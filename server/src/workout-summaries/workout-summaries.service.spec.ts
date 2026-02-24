import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutSummariesService } from './workout-summaries.service';
import { getModelToken } from '@nestjs/mongoose';
import { WorkoutSummary } from './schemas/workout-summary.schema';
import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Types } from 'mongoose';

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
    let eventEmitter: EventEmitter2;

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
        eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a summary', async () => {
            const dto = { workoutId: '507f1f77bcf86cd799439011', userId: '507f1f77bcf86cd799439012', date: new Date(), exercises: [] };
            const result = await service.create(dto);
            expect(result).toBeDefined();
            expect(result.status).toBe('pending');
        });
    });

    describe('updateStatus', () => {
        it('should update summary and emit event when status is completed', async () => {
            const summary = {
                _id: new Types.ObjectId(),
                userId: new Types.ObjectId(),
                workoutId: new Types.ObjectId(),
                summaryJson: { volume: 10 },
            };
            mockQuery.exec.mockResolvedValue(summary);

            const result = await service.updateStatus('507f1f77bcf86cd799439011', 'completed', { summaryText: 'done' });

            expect(result).toBe(summary);
            expect(eventEmitter.emit).toHaveBeenCalledWith('workout.summary.completed', {
                summaryId: summary._id.toString(),
                userId: summary.userId.toString(),
                workoutId: summary.workoutId.toString(),
                summaryJson: summary.summaryJson,
            });
        });

        it('should update summary without emitting event when status is failed', async () => {
            mockQuery.exec.mockResolvedValue({ _id: new Types.ObjectId() });

            await service.updateStatus('507f1f77bcf86cd799439011', 'failed', { error: 'bad' } as any);

            expect(eventEmitter.emit).not.toHaveBeenCalled();
        });

        it('should throw if summary does not exist', async () => {
            mockQuery.exec.mockResolvedValue(null);
            await expect(
                service.updateStatus('507f1f77bcf86cd799439011', 'failed', {}),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return all summaries', async () => {
            mockQuery.exec.mockResolvedValue([{ id: 1 }]);
            await expect(service.findAll()).resolves.toEqual([{ id: 1 }]);
        });
    });

    describe('findByUser', () => {
        it('should return summaries for a user', async () => {
            mockQuery.exec.mockResolvedValue([{ id: 1 }]);
            await expect(service.findByUser('507f1f77bcf86cd799439011')).resolves.toEqual([{ id: 1 }]);
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

    describe('deleteByWorkoutId', () => {
        it('should delete summaries by workout id', async () => {
            mockQuery.exec.mockResolvedValue({ acknowledged: true, deletedCount: 1 });
            await expect(service.deleteByWorkoutId('507f1f77bcf86cd799439011')).resolves.toEqual({
                acknowledged: true,
                deletedCount: 1,
            });
        });
    });
});
