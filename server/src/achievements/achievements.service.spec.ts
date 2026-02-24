import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsService } from './achievements.service';
import { getModelToken } from '@nestjs/mongoose';
import { Achievement } from './schemas/achievement.schema';
import { UserAchievement } from './schemas/user-achievement.schema';
import { User } from '../auth/schemas/user.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('AchievementsService', () => {
    let service: AchievementsService;

    const mockAchievement = {
        _id: new Types.ObjectId(),
        name: 'First Steps',
        icon: 'steps.png',
        toObject: jest.fn().mockReturnValue({ name: 'First Steps', icon: 'steps.png' }),
    };

    const mockUser = {
        _id: new Types.ObjectId(),
        totalXp: 1500,
        level: 2,
    };

    const mockAchievementModel = {
        find: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockAchievement]),
    };

    const mockUserAchievementModel = {
        find: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
    };

    const mockUserModel = {
        findById: jest.fn().mockReturnThis(),
        findByIdAndUpdate: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };

    const mockEventEmitter = {
        emit: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AchievementsService,
                {
                    provide: getModelToken(Achievement.name),
                    useValue: mockAchievementModel,
                },
                {
                    provide: getModelToken(UserAchievement.name),
                    useValue: mockUserAchievementModel,
                },
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
                {
                    provide: EventEmitter2,
                    useValue: mockEventEmitter,
                },
            ],
        }).compile();

        service = module.get<AchievementsService>(AchievementsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all active achievements', async () => {
            const result = await service.findAll();
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('First Steps');
        });

        it('should use fallback icon for unknown achievement names', async () => {
            mockAchievementModel.exec.mockResolvedValueOnce([
                {
                    _id: new Types.ObjectId(),
                    name: 'Unknown Achievement',
                    icon: '/fallback.png',
                    toObject: jest.fn().mockReturnValue({}),
                },
            ]);

            const result = await service.findAll();
            expect(result[0].icon).toBe('/fallback.png');
        });
    });

    describe('findUserAchievements', () => {
        it('should return achievements with user progress', async () => {
            const result = await service.findUserAchievements(new Types.ObjectId().toHexString());
            expect(result).toHaveLength(1);
            expect(result[0].currentTier).toBe('none');
        });

        it('should map existing user progress when present', async () => {
            const achievementId = new Types.ObjectId();
            mockAchievementModel.exec.mockResolvedValueOnce([
                {
                    _id: achievementId,
                    name: 'Volume King',
                    icon: '/old.png',
                    toObject: jest.fn().mockReturnValue({ name: 'Volume King', icon: '/old.png' }),
                },
            ]);
            mockUserAchievementModel.exec.mockResolvedValueOnce([
                {
                    achievementId,
                    currentTier: 'silver',
                    progressValue: 123,
                    unlockedAt: new Date('2025-01-01'),
                    history: [{ tier: 'bronze' }],
                },
            ]);

            const result = await service.findUserAchievements(new Types.ObjectId().toHexString());

            expect(result[0].currentTier).toBe('silver');
            expect(result[0].progressValue).toBe(123);
            expect(result[0].history).toEqual([{ tier: 'bronze' }]);
            expect(result[0].achievement.icon).toBe('/volume-king.png');
        });
    });

    describe('getXpAndLevel', () => {
        it('should return xp and level for user', async () => {
            mockUserModel.exec.mockResolvedValue(mockUser);
            const result = await service.getXpAndLevel(mockUser._id.toHexString());
            expect(result.totalXp).toBe(1500);
            expect(result.level).toBe(2);
        });

        it('should apply default xp and level values when missing', async () => {
            mockUserModel.exec.mockResolvedValue({ _id: new Types.ObjectId() });
            const result = await service.getXpAndLevel(new Types.ObjectId().toHexString());
            expect(result).toEqual({
                totalXp: 0,
                level: 1,
                nextLevelXp: 1000,
            });
        });

        it('should throw NotFoundException if user not found', async () => {
            mockUserModel.exec.mockResolvedValue(null);
            await expect(service.getXpAndLevel(new Types.ObjectId().toHexString())).rejects.toThrow(NotFoundException);
        });
    });

    describe('addXp', () => {
        it('should add xp and update level', async () => {
            mockUserModel.exec.mockResolvedValue(mockUser);
            await service.addXp(mockUser._id.toHexString(), 500);
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalled();
            expect(mockEventEmitter.emit).toHaveBeenCalledWith('xp.earned', expect.any(Object));
        });

        it('should return early when user is not found', async () => {
            mockUserModel.exec.mockResolvedValue(null);
            await service.addXp(new Types.ObjectId().toHexString(), 100);
            expect(mockUserModel.findByIdAndUpdate).not.toHaveBeenCalled();
        });

        it('should use 0 as default totalXp when missing', async () => {
            mockUserModel.exec.mockResolvedValueOnce({ _id: new Types.ObjectId(), level: 1 });
            mockUserModel.exec.mockResolvedValueOnce({ acknowledged: true });

            await service.addXp(new Types.ObjectId().toHexString(), 250);

            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ totalXp: 250, level: 1 }),
            );
        });
    });

    describe('emitUnlockEvent', () => {
        it('should emit achievement unlock event', () => {
            service.emitUnlockEvent('uid', 'First Steps', 'bronze', 'Nice work!');
            expect(mockEventEmitter.emit).toHaveBeenCalledWith('achievement.unlocked', {
                userId: 'uid',
                achievementName: 'First Steps',
                tier: 'bronze',
                aiMessage: 'Nice work!',
            });
        });
    });
});
