import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WorkoutSummariesService } from '../workout-summaries/workout-summaries.service';
import { UserProfilesService } from '../user-profiles/user-profiles.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class AiWorkerService {
    private readonly logger = new Logger(AiWorkerService.name);

    constructor(
        private readonly workoutSummariesService: WorkoutSummariesService,
        private readonly userProfilesService: UserProfilesService,
        private readonly embeddingsService: EmbeddingsService,
        private readonly postsService: PostsService,
    ) { }

    @OnEvent('workout.created')
    async handleWorkoutCreated(payload: { postId: string; userId: string }) {
        this.logger.log(`Processing workout created event for post ${payload.postId}`);

        try {
            // 1. Load workout
            const workout = await this.postsService.findOne(payload.postId);
            if (!workout) {
                this.logger.error(`Workout ${payload.postId} not found`);
                return;
            }

            // 2. Generate Summary (Mocked AI logic)
            this.logger.log(`Generating AI summary for workout: ${workout.title}`);
            const summaryText = `Great session on "${workout.title}"! You focused on ${workout.workoutDetails?.type || 'general fitness'} for ${workout.workoutDetails?.duration || 0} minutes, burning approximately ${workout.workoutDetails?.calories || 0} calories. Keep up the consistency!`;

            const summaryJson = {
                volume: Math.floor(Math.random() * 5000) + 1000,
                intensity: "moderate",
                focusPoints: [workout.workoutDetails?.type || 'strength'],
                caloriesBurned: workout.workoutDetails?.calories || 0,
                duration: workout.workoutDetails?.duration || 0
            };

            // 3. Save to workout_summaries
            const summary = await this.workoutSummariesService.create({
                workoutId: payload.postId,
                userId: payload.userId,
                summaryText,
                summaryJson,
            });

            this.logger.log(`Saved workout summary ${summary['_id']}`);

            // 4. Trigger Profile Update and Embedding
            await Promise.all([
                this.updateUserProfile(payload.userId, summaryText, summaryJson),
                this.generateEmbedding(payload.userId, 'workout_summary', summary['_id'].toString(), summaryText)
            ]);

        } catch (error) {
            this.logger.error(`Error processing workout created: ${error.message}`, error.stack);
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

    private async generateEmbedding(userId: string, refType: string, refId: string, text: string) {
        this.logger.log(`Generating embedding for ${refType} ${refId}`);
        try {
            // Mock embedding vector (usually 1536 or 768 dimensions)
            const mockVector = Array.from({ length: 10 }, () => Math.random());

            await this.embeddingsService.create({
                userId,
                refType,
                refId,
                vector: mockVector,
                text,
            });

            this.logger.log(`Embedding saved for ${refType} ${refId}`);
        } catch (error) {
            this.logger.error(`Error generating embedding: ${error.message}`);
        }
    }
}
