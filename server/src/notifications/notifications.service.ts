import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface AppNotification {
    type: 'achievement_unlocked' | 'xp_earned' | 'system';
    data: any;
    userId: string;
    timestamp: Date;
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    private readonly notifications$ = new Subject<AppNotification>();

    @OnEvent('achievement.unlocked')
    handleAchievementUnlocked(payload: { userId: string, achievementName: string, tier: string, aiMessage?: string }) {
        this.logger.log(`Achievement notification triggered for user ${payload.userId}`);
        this.notifications$.next({
            type: 'achievement_unlocked',
            userId: payload.userId,
            data: {
                title: 'Achievement Unlocked!',
                message: `You reached ${payload.tier} tier for ${payload.achievementName}!`,
                aiCoachMessage: payload.aiMessage,
                achievementName: payload.achievementName,
                tier: payload.tier,
            },
            timestamp: new Date(),
        });
    }

    @OnEvent('xp.earned')
    handleXpEarned(payload: { userId: string, xp: number, totalXp: number, level: number }) {
        this.notifications$.next({
            type: 'xp_earned',
            userId: payload.userId,
            data: payload,
            timestamp: new Date(),
        });
    }

    stream(userId: string): Observable<any> {
        this.logger.log(`User ${userId} connected to notification stream`);
        return this.notifications$.pipe(
            filter(n => n.userId === userId),
            map(n => ({ data: n }))
        );
    }
}
