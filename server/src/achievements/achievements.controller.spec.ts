import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';

describe('AchievementsController', () => {
    let controller: AchievementsController;
    let service: AchievementsService;

    const mockAchievementsService = {
        findUserAchievements: jest.fn(),
        getXpAndLevel: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AchievementsController],
            providers: [
                {
                    provide: AchievementsService,
                    useValue: mockAchievementsService,
                },
            ],
        }).compile();

        controller = module.get<AchievementsController>(AchievementsController);
        service = module.get<AchievementsService>(AchievementsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAllAchievements', () => {
        it('should return all achievements', async () => {
            const result = [{ name: 'A1', icon: 'i.png' }];
            mockAchievementsService.findAll = jest.fn().mockResolvedValue(result);
            expect(await controller.getAllAchievements()).toBe(result);
            expect(mockAchievementsService.findAll).toHaveBeenCalled();
        });
    });

    describe('getMyAchievements', () => {
        it('should return my achievements', async () => {
            const result = [{ achievement: { name: 'A1' } }];
            mockAchievementsService.findUserAchievements.mockResolvedValue(result);
            const req = { user: { userId: 'uid' } };
            expect(await controller.getMyAchievements(req)).toBe(result);
            expect(service.findUserAchievements).toHaveBeenCalledWith('uid');
        });
    });

    describe('getMyXp', () => {
        it('should return my xp', async () => {
            const result = { totalXp: 100, level: 1 };
            mockAchievementsService.getXpAndLevel.mockResolvedValue(result);
            const req = { user: { userId: 'uid' } };
            expect(await controller.getMyXp(req)).toBe(result);
            expect(service.getXpAndLevel).toHaveBeenCalledWith('uid');
        });
    });
});
