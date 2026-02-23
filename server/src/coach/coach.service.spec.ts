import { Test, TestingModule } from '@nestjs/testing';
import { CoachService } from './coach.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { WorkoutSummariesService } from '../workout-summaries/workout-summaries.service';
import { UserProfilesService } from '../user-profiles/user-profiles.service';
import { OpenaiService } from '../openai/openai.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('CoachService', () => {
    let service: CoachService;

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
                {
                    provide: EventEmitter2,
                    useValue: {
                        emit: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CoachService>(CoachService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('askStream', () => {
        it('should return an observable', () => {
            const result = service.askStream('uid', 'q');
            expect(result).toBeDefined();
        });
    });
});
