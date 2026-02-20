import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../components/Auth/AuthProvider';
import {
    ACHIEVEMENT_ICON_BY_NAME,
    getAchievementShareCopy,
} from '@/constants/achievements';

export interface AchievementUnlockNotification {
    achievementName: string;
    tier: string;
    aiCoachMessage?: string;
    icon: string;
    shareTitle: string;
    shareDescription: string;
}

export const useNotifications = (
    onShareAchievement?: (achievement: AchievementUnlockNotification) => void,
) => {
    const { loggedUser, isAuthenticated } = useAuth();
    const [reconnectTick, setReconnectTick] = useState(0);

    useEffect(() => {
        if (!isAuthenticated || !loggedUser?.userId) return;

        const url = `/api/notifications/stream`;
        const eventSource = new EventSource(url, { withCredentials: true });
        let reconnectTimer: number | undefined;

        eventSource.onmessage = (event) => {
            try {
                if (!event.data) return;

                const parsed = JSON.parse(event.data);
                const notification =
                    parsed?.type ? parsed : parsed?.data?.type ? parsed.data : null;

                if (!notification?.type) return;

                if (notification.type === 'achievement_unlocked') {
                    const { title, message, aiCoachMessage, achievementName, tier } = notification.data;
                    const icon =
                        ACHIEVEMENT_ICON_BY_NAME[achievementName] || '/placeholder.svg';
                    const shareCopy = getAchievementShareCopy(achievementName, tier);
                    const achievementPayload: AchievementUnlockNotification = {
                        achievementName,
                        tier,
                        aiCoachMessage,
                        icon,
                        shareTitle: shareCopy.title,
                        shareDescription: shareCopy.description,
                    };

                    toast.success(title, {
                        description: message,
                        duration: 12000,
                        action: {
                            label: 'Share as Post',
                            onClick: () => onShareAchievement?.(achievementPayload),
                        },
                        cancel: {
                            label: 'Later',
                            onClick: () => { },
                        },
                    });

                    if (aiCoachMessage) {
                        // Show AI message shortly after
                        setTimeout(() => {
                            toast(achievementName, {
                                description: `Coach: "${aiCoachMessage}"`,
                                duration: 10000,
                            });
                        }, 1000);
                    }
                }

                if (notification.type === 'xp_earned') {
                    const { xp, level } = notification.data;
                    toast(`+${xp} XP`, {
                        description: `Current Level: ${level}`,
                        duration: 3000,
                    });
                }
            } catch (err) {
                console.error('Failed to parse notification:', err);
            }
        };

        eventSource.onerror = (err) => {
            console.error('SSE connection error:', err);
            eventSource.close();

            reconnectTimer = window.setTimeout(() => {
                setReconnectTick((prev) => prev + 1);
            }, 5000);
        };

        return () => {
            if (reconnectTimer) {
                window.clearTimeout(reconnectTimer);
            }
            eventSource.close();
        };
    }, [isAuthenticated, loggedUser?.userId, reconnectTick, onShareAchievement]);
};
