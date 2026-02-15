import { Test, TestingModule } from '@nestjs/testing';
import { CoachService } from './coach.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { WorkoutSummariesService } from '../workout-summaries/workout-summaries.service';
import { UserProfilesService } from '../user-profiles/user-profiles.service';
import { OpenaiService } from '../openai/openai.service';
import { ServiceUnavailableException } from '@nestjs/common';

describe('CoachService', () => {
    let service: CoachService;
    let embeddingsService: EmbeddingsService;
    let workoutSummariesService: WorkoutSummariesService;
    let userProfilesService: UserProfilesService;
    let openaiService: OpenaiService;

    const mockEmbeddingsService = {
        findSimilar: jest.fn(),
    };
    const mockWorkoutSummariesService = {
        findByWorkout: jest.fn(),
    };
    const mockUserProfilesService = {
        findByUser: jest.fn(),
    };
    const mockOpenaiService = {
        generateEmbedding: jest.fn(),
        generateCoachAnswer: jest.fn(),
        generateCoachAnswerStream: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CoachService,
                { provide: EmbeddingsService, useValue: mockEmbeddingsService },
                { provide: WorkoutSummariesService, useValue: mockWorkoutSummariesService },
                { provide: UserProfilesService, useValue: mockUserProfilesService },
                { provide: OpenaiService, useValue: mockOpenaiService },
            ],
        }).compile();

        service = module.get<CoachService>(CoachService);
        embeddingsService = module.get<EmbeddingsService>(EmbeddingsService);
        workoutSummariesService = module.get<WorkoutSummariesService>(WorkoutSummariesService);
        userProfilesService = module.get<UserProfilesService>(UserProfilesService);
        openaiService = module.get<OpenaiService>(OpenaiService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('ask', () => {
        it('should return answer and next steps', async () => {
            mockOpenaiService.generateEmbedding.mockResolvedValue([0.1]);
            mockEmbeddingsService.findSimilar.mockResolvedValue([
                { refType: 'workout_summary', refId: 'sid' }
            ]);
            mockWorkoutSummariesService.findByWorkout.mockResolvedValue({ _id: 'sid', summaryText: 'summary', createdAt: new Date() });
            mockUserProfilesService.findByUser.mockResolvedValue({ age: 25 });
            mockOpenaiService.generateCoachAnswer.mockResolvedValue({
                answer: 'Answer',
                suggestedNextSteps: ['Step 1'],
                references: [1]
            });

            const result = await service.ask('uid', 'question');

            expect(result.answer).toBe('Answer');
            expect(result.suggestedNextSteps).toEqual(['Step 1']);
            expect(result.references).toHaveLength(1);
        });

        it('should handle unavailable OpenAI service', async () => {
            mockOpenaiService.generateEmbedding.mockRejectedValue(new Error('OpenAI error'));
            await expect(service.ask('uid', 'q')).rejects.toThrow(ServiceUnavailableException);
        });
    });
});
