import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../components/Auth/AuthProvider';

export const useNotifications = () => {
    const { loggedUser, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !loggedUser?.userId) return;

        const url = `/api/notifications/stream`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            try {
                const notification = JSON.parse(event.data);

                if (notification.type === 'achievement_unlocked') {
                    const { title, message, aiCoachMessage, achievementName, tier } = notification.data;

                    toast.success(title, {
                        description: message,
                        duration: 8000,
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

            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
                // This will trigger the effect again because of dependencies
            }, 5000);
        };

        return () => {
            eventSource.close();
        };
    }, [isAuthenticated, loggedUser?.userId]);
};
