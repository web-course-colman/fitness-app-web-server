import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { WorkoutSummariesService } from '../workout-summaries/workout-summaries.service';
import { UserProfilesService } from '../user-profiles/user-profiles.service';

@Injectable()
export class CoachService {
    private readonly logger = new Logger(CoachService.name);

    constructor(
        private readonly embeddingsService: EmbeddingsService,
        private readonly workoutSummariesService: WorkoutSummariesService,
        private readonly userProfilesService: UserProfilesService,
    ) { }

    async ask(userId: string, question: string) {
        this.logger.log(`Coach query from user ${userId}: "${question}"`);

        // 1. Smart Routing (Mocked)
        // If question is very simple, we could answer directly. 
        // For this flow, we'll proceed to RAG as requested.

        // 2. Generate embedding for the question (Mocked)
        const queryVector = Array.from({ length: 10 }, () => Math.random());

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

        // 5. Generate Answer (Mocked LLM call)
        // In a real app, we'd send (question + profileContext + validSummaries) to OpenAI/Gemini.

        const answer = this.generateMockAnswer(question, profileContext, validSummaries);

        return {
            answer: answer.text,
            suggestedNextSteps: answer.nextSteps,
            references: validSummaries.map(s => ({
                id: s['_id'],
                text: s.summaryText,
                date: s['createdAt']
            }))
        };
    }

    private generateMockAnswer(question: string, profile: string, summaries: any[]) {
        const q = question.toLowerCase();

        if (q.includes('squat')) {
            return {
                text: "Based on your history, your last heavy squat session was on Jan 28. You felt strong and managed 3 sets of 5 at 100kg. Your profile shows you are focusing on strength gains.",
                nextSteps: ["Try increasing the weight by 2.5kg for your next session.", "Ensure you have a 48h recovery period."]
            };
        }

        if (q.includes('protein')) {
            return {
                text: "Looking at your recent summaries, you've been consistent with your post-workout nutrition. Your goals suggest you should aim for ~160g of protein daily.",
                nextSteps: ["Track your intake for tomorrow to verify you hit the target.", "Consider a casein shake before sleep."]
            };
        }

        return {
            text: `I've analyzed your ${summaries.length} recent sessions and your overall profile. You are making steady progress. How can I help you refine your current training block?`,
            nextSteps: ["Ask about a specific exercise", "Review your weekly volume trend"]
        };
    }
}
