import { Test, TestingModule } from '@nestjs/testing';
import { UserProfilesController } from './user-profiles.controller';
import { UserProfilesService } from './user-profiles.service';

describe('UserProfilesController', () => {
    let controller: UserProfilesController;
    let service: UserProfilesService;

    const mockService = {
        upsert: jest.fn(),
        findByUser: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserProfilesController],
            providers: [
                {
                    provide: UserProfilesService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<UserProfilesController>(UserProfilesController);
        service = module.get<UserProfilesService>(UserProfilesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('upsert', () => {
        it('should call service.upsert', async () => {
            const dto = {
                userId: 'uid',
                age: 20,
                height: 170,
                weight: 70,
                fitnessGoals: [],
                fitnessLevel: 'beginner' as any,
                profileSummaryText: '',
                profileSummaryJson: {},
                version: 1
            };
            mockService.upsert.mockResolvedValue('profile');
            expect(await controller.upsert(dto)).toBe('profile');
            expect(service.upsert).toHaveBeenCalledWith(dto);
        });
    });

    describe('findByUser', () => {
        it('should call service.findByUser', async () => {
            mockService.findByUser.mockResolvedValue('profile');
            expect(await controller.findByUser('uid')).toBe('profile');
            expect(service.findByUser).toHaveBeenCalledWith('uid');
        });
    });
});
