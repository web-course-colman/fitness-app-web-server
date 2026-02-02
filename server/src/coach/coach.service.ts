import { Injectable, Logger, ServiceUnavailableException, HttpException, HttpStatus } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { WorkoutSummariesService } from '../workout-summaries/workout-summaries.service';
import { UserProfilesService } from '../user-profiles/user-profiles.service';
import { OpenaiService } from '../openai/openai.service';
import { UserProfile } from '../user-profiles/schemas/user-profile.schema';
import { Observable } from 'rxjs';

function buildProfileContext(profile: UserProfile): string {
    const parts: string[] = [];
    if (profile.profileSummaryText?.trim()) {
        parts.push(profile.profileSummaryText.trim());
    }
    const stats: string[] = [];
    if (profile.height != null) stats.push(`Height: ${profile.height} cm`);
    if (profile.currentWeight != null) stats.push(`Current weight: ${profile.currentWeight} kg`);
    if (profile.age != null) stats.push(`Age: ${profile.age}`);
    if (profile.sex) stats.push(`Sex: ${profile.sex}`);
    if (profile.bodyFatPercentage != null) stats.push(`Body fat: ${profile.bodyFatPercentage}%`);
    if (profile.vo2max != null) stats.push(`VO2max: ${profile.vo2max} ml/kg/min`);
    if (profile.oneRm) {
        const oneRm = profile.oneRm;
        const lifts = [oneRm.squat != null && `Squat ${oneRm.squat} kg`, oneRm.bench != null && `Bench ${oneRm.bench} kg`, oneRm.deadlift != null && `Deadlift ${oneRm.deadlift} kg`].filter(Boolean);
        if (lifts.length) stats.push(`1RM: ${lifts.join(', ')}`);
    }
    if (profile.workoutsPerWeek != null) stats.push(`Workouts per week: ${profile.workoutsPerWeek}`);
    if (stats.length) {
        parts.push('Fitness stats: ' + stats.join('. '));
    }
    return parts.length ? parts.join('\n\n') : 'No profile summary available.';
}

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

        // b. User Profile Context (full user-profile doc)
        let profileContext = "No profile summary available.";
        try {
            const profile = await this.userProfilesService.findByUser(userId);
            profileContext = buildProfileContext(profile);
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

    askStream(userId: string, question: string): Observable<any> {
        return new Observable(subscriber => {
            (async () => {
                try {
                    this.logger.log(`Coach query (stream) from user ${userId}: "${question}"`);

                    // 1. Generate embedding
                    let queryVector;
                    try {
                        queryVector = await this.openaiService.generateEmbedding(question);
                    } catch (error: any) {
                        this.logger.error(`Failed to generate query embedding: ${error.message}`);
                        subscriber.error(new ServiceUnavailableException('The AI Coach is currently unavailable.'));
                        return;
                    }

                    // 2. Fetch Top-K closest embeddings
                    const similarEmbeddings = await this.embeddingsService.findSimilar(queryVector, userId, 5);
                    const summaryIds = similarEmbeddings
                        .filter(emb => emb.refType === 'workout_summary')
                        .map(emb => emb.refId.toString());

                    const summaries = await Promise.all(
                        summaryIds.map(id => this.workoutSummariesService.findByWorkout(id).catch(() => null))
                    );
                    const validSummaries = summaries.filter(s => s !== null);

                    // 3. User Profile Context
                    let profileContext = "No profile summary available.";
                    try {
                        const profile = await this.userProfilesService.findByUser(userId);
                        profileContext = buildProfileContext(profile);
                    } catch (e) {
                        this.logger.warn(`No profile found for user ${userId}`);
                    }

                    // 4. Generate Answer Stream via OpenAI
                    const stream = await this.openaiService.generateCoachAnswerStream(question, profileContext, validSummaries);

                    const delimiter = "||METADATA||";
                    let buffer = "";
                    let isCollectingMetadata = false;
                    let metadataBuffer = "";

                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (!content) continue;

                        if (isCollectingMetadata) {
                            metadataBuffer += content;
                        } else {
                            buffer += content;
                            const delimiterIndex = buffer.indexOf(delimiter);

                            if (delimiterIndex !== -1) {
                                // Found delimiter!
                                const textPart = buffer.substring(0, delimiterIndex);
                                const remainder = buffer.substring(delimiterIndex + delimiter.length);

                                if (textPart) {
                                    subscriber.next({ type: 'message', data: textPart });
                                }

                                isCollectingMetadata = true;
                                metadataBuffer = remainder;
                                buffer = ""; // Clear buffer
                            } else {
                                // No delimiter yet. 
                                // To avoid splitting the delimiter (e.g. have "||MET" at end of buffer),
                                // we only emit safe parts.
                                // Keep the last (delimiter.length - 1) chars in buffer.
                                const keepLength = delimiter.length - 1;
                                if (buffer.length > keepLength) {
                                    const toEmit = buffer.substring(0, buffer.length - keepLength);
                                    subscriber.next({ type: 'message', data: toEmit });
                                    buffer = buffer.substring(buffer.length - keepLength);
                                }
                            }
                        }
                    }

                    // Flush any remaining text in buffer if we never found metadata (shouldn't happen if AI follows instructions, but safety first)
                    if (!isCollectingMetadata && buffer.length > 0) {
                        subscriber.next({ type: 'message', data: buffer });
                    }

                    // Process Metadata
                    if (metadataBuffer.trim()) {
                        try {
                            const result = JSON.parse(metadataBuffer); // It might be partial if stream cut off, but assuming complete.

                            // Resolve references
                            const resolvedReferences = result.references?.map(refIndex => {
                                const summary = validSummaries[refIndex - 1];
                                if (!summary) return null;
                                return {
                                    id: summary['_id'],
                                    text: summary.summaryText,
                                    date: summary['createdAt']
                                };
                            }).filter(ref => ref !== null) || [];

                            subscriber.next({
                                type: 'metadata',
                                data: {
                                    suggestedNextSteps: result.suggestedNextSteps,
                                    references: resolvedReferences
                                }
                            });
                        } catch (e) {
                            this.logger.error(`Failed to parse metadata JSON: ${metadataBuffer}`);
                        }
                    }

                } catch (err) {
                    this.logger.error(err);
                    subscriber.error(err);
                }
                subscriber.complete();
            })();
        });
    }
}

