import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutSummariesService } from './workout-summaries.service';
import { getModelToken } from '@nestjs/mongoose';
import { WorkoutSummary } from './schemas/workout-summary.schema';
import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Mock class for the model
class MockWorkoutSummaryModel {
    constructor(public data: any) {
        Object.assign(this, data);
    }
    save = jest.fn().mockImplementation(function () { return Promise.resolve(this); });
    static find = jest.fn();
    static findByIdAndUpdate = jest.fn();
    static findOne = jest.fn();
    static deleteMany = jest.fn();
}

describe('WorkoutSummariesService', () => {
    let service: WorkoutSummariesService;

    const mockQuery = {
        exec: jest.fn(),
    };

    beforeEach(async () => {
        MockWorkoutSummaryModel.find.mockReturnValue(mockQuery);
        MockWorkoutSummaryModel.findByIdAndUpdate.mockReturnValue(mockQuery);
        MockWorkoutSummaryModel.findOne.mockReturnValue(mockQuery);
        MockWorkoutSummaryModel.deleteMany.mockReturnValue(mockQuery);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkoutSummariesService,
                {
                    provide: getModelToken(WorkoutSummary.name),
                    useValue: MockWorkoutSummaryModel,
                },
                {
                    provide: EventEmitter2,
                    useValue: {
                        emit: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<WorkoutSummariesService>(WorkoutSummariesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a summary', async () => {
            const dto = { workoutId: '507f1f77bcf86cd799439011', userId: '507f1f77bcf86cd799439012', date: new Date(), exercises: [] };
            const result = await service.create(dto);
            expect(result).toBeDefined();
        });
    });

    describe('findByWorkout', () => {
        it('should find summary', async () => {
            mockQuery.exec.mockResolvedValue({});
            const result = await service.findByWorkout('507f1f77bcf86cd799439011');
            expect(result).toBeDefined();
        });

        it('should throw if not found', async () => {
            mockQuery.exec.mockResolvedValue(null);
            await expect(service.findByWorkout('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
        });
    });
});
