import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
    private readonly openai: OpenAI;
    private readonly logger = new Logger(OpenaiService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        this.openai = new OpenAI({ apiKey });
    }

    async generateSummary(workoutContent: string) {
        this.logger.log('Generating AI summary for workout...');
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a fitness coach. Summarize the user's workout in a motivating and concise way (max 2-3 sentences). 
                    Also provide a JSON object with:
                    - volume: estimated total weight or reps
                    - intensity: 'low', 'moderate', or 'high'
                    - focusPoints: array of muscle groups or skills worked
                    - caloriesBurned: estimate if not provided
                    - duration: minutes
                    
                    Respond ONLY with a JSON in this format:
                    {
                        "summaryText": "...",
                        "summaryJson": { ... }
                    }`
                },
                {
                    role: 'user',
                    content: workoutContent
                }
            ],
            response_format: { type: 'json_object' }
        });

        return JSON.parse(response.choices[0].message.content);
    }

    async generateEmbedding(text: string): Promise<number[]> {
        this.logger.log('Generating OpenAI embedding...');
        const response = await this.openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
            encoding_format: 'float',
        });

        return response.data[0].embedding;
    }

    async generateCoachAnswer(question: string, profile: string, contexts: any[]) {
        this.logger.log('Generating AI Coach answer...');

        const contextString = contexts.map((s, i) =>
            `Workout ${i + 1} (${new Date(s.createdAt).toLocaleDateString()}): ${s.summaryText}`
        ).join('\n');

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert AI Fitness Coach. Use the user's profile and workout history to answer their question.
                    
                    User Profile: ${profile}
                    
                    Relevant Workout History:
                    ${contextString}
                    
                    Respond in JSON format with:
                    - answer: A friendly, personalized, and evidence-based answer.
                    - suggestedNextSteps: A list (max 3) of specific follow-up actions.
                    - references: A list of workout summaries you used to answer (cite them by index from context).
                    
                    If you don't have enough data, be honest and ask for more details.`
                },
                {
                    role: 'user',
                    content: question
                }
            ],
            response_format: { type: 'json_object' }
        });

        return JSON.parse(response.choices[0].message.content);
    }
}
