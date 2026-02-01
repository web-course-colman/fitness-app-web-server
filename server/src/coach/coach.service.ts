import { Injectable, Logger, ServiceUnavailableException, HttpException, HttpStatus } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { WorkoutSummariesService } from '../workout-summaries/workout-summaries.service';
import { UserProfilesService } from '../user-profiles/user-profiles.service';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class CoachService {
    private readonly logger = new Logger(CoachService.name);

    constructor(
        private readonly embeddingsService: EmbeddingsService,
        private readonly workoutSummariesService: WorkoutSummariesService,
        private readonly userProfilesService: UserProfilesService,
        private readonly openaiService: OpenaiService,
    ) { }

    async ask(userId: string, question: string) {
        this.logger.log(`Coach query from user ${userId}: "${question}"`);

        // 1. Smart Routing (Mocked)
        // If question is very simple, we could answer directly. 
        // For this flow, we'll proceed to RAG as requested.

        // 2. Generate embedding for the question via OpenAI
        let queryVector;
        try {
            queryVector = await this.openaiService.generateEmbedding(question);
        } catch (error: any) {
            this.logger.error(`Failed to generate query embedding: ${error.message}`);
            if (error.status === 429) {
                throw new HttpException('OpenAI Rate Limit Exceeded. Please try again soon.', HttpStatus.TOO_MANY_REQUESTS);
            }
            throw new ServiceUnavailableException('The AI Coach is currently unavailable. Please try again later.');
        }

        // 3. Fetch Top-K closest embeddings
        const similarEmbeddings = await this.embeddingsService.findSimilar(queryVector, userId, 5);
        this.logger.log(`Found ${similarEmbeddings.length} relevant context fragments`);

        // 4. Load contexts
        // a. Relevant workout summaries
        const summaryIds = similarEmbeddings
            .filter(emb => emb.refType === 'workout_summary')
            .map(emb => emb.refId.toString());

        const summaries = await Promise.all(
            summaryIds.map(id => this.workoutSummariesService.findByWorkout(id).catch(() => null))
        );
        const validSummaries = summaries.filter(s => s !== null);

        // b. User Profile Context
        let profileContext = "No profile summary available.";
        try {
            const profile = await this.userProfilesService.findByUser(userId);
            profileContext = profile.profileSummaryText;
        } catch (e) {
            this.logger.warn(`No profile found for user ${userId}`);
        }

        // 5. Generate Answer via OpenAI (RAG)
        let result;
        try {
            result = await this.openaiService.generateCoachAnswer(question, profileContext, validSummaries);
        } catch (error: any) {
            this.logger.error(`Coach answer generation failed: ${error.message}`);
            if (error.status === 429) {
                throw new HttpException('OpenAI Rate Limit Exceeded. Please try again soon.', HttpStatus.TOO_MANY_REQUESTS);
            }
            throw new ServiceUnavailableException('The AI Coach failed to generate an answer. Please try again later.');
        }

        return {
            answer: result.answer,
            suggestedNextSteps: result.suggestedNextSteps,
            references: result.references?.map(refIndex => {
                const summary = validSummaries[refIndex - 1]; // OpenAI returns 1-based index
                if (!summary) return null;
                return {
                    id: summary['_id'],
                    text: summary.summaryText,
                    date: summary['createdAt']
                };
            }).filter(ref => ref !== null) || []
        };
    }
}
