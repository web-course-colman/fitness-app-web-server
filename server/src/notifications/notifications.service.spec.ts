import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
    let service: NotificationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [NotificationsService],
        }).compile();

        service = module.get<NotificationsService>(NotificationsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('handleAchievementUnlocked', () => {
        it('should push notification to stream', (done) => {
            const payload = { userId: 'uid', achievementName: 'A1', tier: 'gold' };
            service.stream('uid').subscribe((n) => {
                expect(n.data.type).toBe('achievement_unlocked');
                expect(n.data.userId).toBe('uid');
                done();
            });
            service.handleAchievementUnlocked(payload);
        });
    });

    describe('handleXpEarned', () => {
        it('should push xp notification to stream', (done) => {
            const payload = { userId: 'uid', xp: 100, totalXp: 100, level: 1 };
            service.stream('uid').subscribe((n) => {
                expect(n.data.type).toBe('xp_earned');
                expect(n.data.userId).toBe('uid');
                done();
            });
            service.handleXpEarned(payload);
        });
    });
});
