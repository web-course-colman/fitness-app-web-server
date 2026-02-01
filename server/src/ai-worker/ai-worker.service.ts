import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WorkoutSummariesService } from '../workout-summaries/workout-summaries.service';
import { UserProfilesService } from '../user-profiles/user-profiles.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { PostsService } from '../posts/posts.service';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class AiWorkerService {
    private readonly logger = new Logger(AiWorkerService.name);

    constructor(
        private readonly workoutSummariesService: WorkoutSummariesService,
        private readonly userProfilesService: UserProfilesService,
        private readonly embeddingsService: EmbeddingsService,
        private readonly postsService: PostsService,
        private readonly openaiService: OpenaiService,
    ) { }

    @OnEvent('workout.created')
    async handleWorkoutCreated(payload: { postId: string; userId: string }) {
        this.logger.log(`Processing workout created event for post ${payload.postId}`);

        // 1. Create a pending summary record immediately
        let summary;
        try {
            summary = await this.workoutSummariesService.create({
                workoutId: payload.postId,
                userId: payload.userId,
            });
            this.logger.log(`Created pending workout summary ${summary['_id']}`);
        } catch (error) {
            this.logger.error(`Failed to create pending summary: ${error.message}`);
            return;
        }

        try {
            // 2. Load workout
            const workout = await this.postsService.findOne(payload.postId);
            if (!workout) {
                this.logger.error(`Workout ${payload.postId} not found`);
                await this.workoutSummariesService.updateStatus(summary['_id'].toString(), 'failed', {
                    error: 'Workout post not found'
                });
                return;
            }

            // 3. Generate Summary via OpenAI
            this.logger.log(`Generating AI summary for workout: ${workout.title}`);
            const workoutDesc = `${workout.title}. ${workout.description || ''}. Details: ${JSON.stringify(workout.workoutDetails || {})}`;

            let aiResult;
            try {
                aiResult = await this.openaiService.generateSummary(workoutDesc);
            } catch (error) {
                this.logger.error(`OpenAI summary generation failed: ${error.message}`);
                await this.workoutSummariesService.updateStatus(summary['_id'].toString(), 'failed', {
                    error: `AI processing failed: ${error.message}`
                });
                return;
            }

            const { summaryText, summaryJson } = aiResult;

            // 4. Update summary to completed
            await this.workoutSummariesService.updateStatus(summary['_id'].toString(), 'completed', {
                summaryText,
                summaryJson,
            });

            this.logger.log(`Completed workout summary ${summary['_id']}`);

            // 5. Trigger Profile Update and Embedding
            await Promise.all([
                this.updateUserProfile(payload.userId, summaryText, summaryJson),
                this.generateEmbedding(payload.userId, 'workout_summary', summary['_id'].toString(), summaryText)
            ]);

        } catch (error) {
            this.logger.error(`Error processing workout created: ${error.message}`, error.stack);
            if (summary) {
                await this.workoutSummariesService.updateStatus(summary['_id'].toString(), 'failed', {
                    error: `Unexpected error: ${error.message}`
                });
            }
        }
    }

    private async updateUserProfile(userId: string, newSummaryText: string, newSummaryJson: any) {
        this.logger.log(`Updating user profile for user ${userId}`);
        try {
            let existingProfile;
            try {
                existingProfile = await this.userProfilesService.findByUser(userId);
            } catch (e) {
                // Profile might not exist yet
                existingProfile = null;
            }

            const updatedText = existingProfile
                ? `Previous highlights included consistent training. Latest update: ${newSummaryText}`.substring(0, 2500)
                : newSummaryText;

            const updatedJson = existingProfile
                ? { ...existingProfile.profileSummaryJson, lastWorkout: newSummaryJson, updateCount: (existingProfile.version || 1) + 1 }
                : { lastWorkout: newSummaryJson, updateCount: 1 };

            await this.userProfilesService.upsert({
                userId,
                profileSummaryText: updatedText,
                profileSummaryJson: updatedJson,
                version: (existingProfile?.version || 0) + 1
            });

            this.logger.log(`User profile updated for user ${userId}`);
        } catch (error) {
            this.logger.error(`Error updating user profile: ${error.message}`);
        }
    }

    private async generateEmbedding(userId: string, refType: 'workout_summary' | 'workout', refId: string, text: string) {
        this.logger.log(`Generating embedding for ${refType} ${refId}`);
        try {
            let vector;
            try {
                vector = await this.openaiService.generateEmbedding(text);
            } catch (error) {
                this.logger.error(`OpenAI embedding generation failed: ${error.message}`);
                return; // Silently fail for embeddings to not block other processes, but log it
            }

            await this.embeddingsService.create({
                userId,
                refType,
                refId,
                vector,
                text,
            });

            this.logger.log(`Embedding saved for ${refType} ${refId}`);
        } catch (error) {
            this.logger.error(`Error generating embedding: ${error.message}`);
        }
    }
}
