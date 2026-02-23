import { Test, TestingModule } from '@nestjs/testing';
import { UserProfilesService } from './user-profiles.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserProfile } from './schemas/user-profile.schema';
import { NotFoundException } from '@nestjs/common';
import { AchievementsService } from '../achievements/achievements.service';

describe('UserProfilesService', () => {
    let service: UserProfilesService;
    let model: any;

    const mockUserProfile = {
        userId: 'userId',
        age: 25,
        height: 180,
        weight: 75,
        save: jest.fn(),
    };

    const mockModel = {
        findOneAndUpdate: jest.fn(),
        findOne: jest.fn(),
    };

    const mockQuery = {
        exec: jest.fn(),
    };

    beforeEach(async () => {
        mockModel.findOneAndUpdate.mockReturnValue(mockQuery);
        mockModel.findOne.mockReturnValue(mockQuery);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserProfilesService,
                {
                    provide: getModelToken(UserProfile.name),
                    useValue: mockModel,
                },
                {
                    provide: AchievementsService,
                    useValue: {
                        findUserAchievements: jest.fn(),
                        getXpAndLevel: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserProfilesService>(UserProfilesService);
        model = module.get(getModelToken(UserProfile.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('upsert', () => {
        it('should upsert a user profile', async () => {
            mockQuery.exec.mockResolvedValue(mockUserProfile);
            const dto = {
                userId: '507f1f77bcf86cd799439011',
                age: 25,
                height: 180,
                weight: 75,
                fitnessGoals: [],
                fitnessLevel: 'beginner' as any,
                profileSummaryText: '',
                profileSummaryJson: {},
                version: 1
            };
            const result = await service.upsert(dto);
            expect(result).toEqual(mockUserProfile);
            expect(model.findOneAndUpdate).toHaveBeenCalled();
        });
    });

    describe('findByUser', () => {
        it('should return a user profile', async () => {
            mockQuery.exec.mockResolvedValue(mockUserProfile);
            const result = await service.findByUser('507f1f77bcf86cd799439011');
            expect(result).toEqual(mockUserProfile);
        });

        it('should throw NotFoundException if not found', async () => {
            mockQuery.exec.mockResolvedValue(null);
            await expect(service.findByUser('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
        });
    });
});
