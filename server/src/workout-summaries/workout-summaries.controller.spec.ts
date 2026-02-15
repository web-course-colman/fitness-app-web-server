import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutSummariesController } from './workout-summaries.controller';
import { WorkoutSummariesService } from './workout-summaries.service';

describe('WorkoutSummariesController', () => {
    let controller: WorkoutSummariesController;
    let service: WorkoutSummariesService;

    const mockService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByUser: jest.fn(),
        findByWorkout: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkoutSummariesController],
            providers: [
                {
                    provide: WorkoutSummariesService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<WorkoutSummariesController>(WorkoutSummariesController);
        service = module.get<WorkoutSummariesService>(WorkoutSummariesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create', async () => {
            const dto = { workoutId: 'wid', userId: 'uid', date: new Date(), exercises: [] };
            mockService.create.mockResolvedValue('summary');
            expect(await controller.create(dto)).toBe('summary');
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findByWorkout', () => {
        it('should call service.findByWorkout', async () => {
            mockService.findByWorkout.mockResolvedValue('summary');
            expect(await controller.findByWorkout('wid')).toBe('summary');
            expect(service.findByWorkout).toHaveBeenCalledWith('wid');
        });
    });
});
