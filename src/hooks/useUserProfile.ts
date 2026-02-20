import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";

export interface UserAchievement {
    achievementId: string;
    achievement: {
        name: string;
        description: string;
        category: string;
        icon: string;
        tiers: { level: string; value: number }[];
    };
    currentTier: string;
    progressValue: number;
    unlockedAt?: string;
    history: {
        tier: string;
        unlockedAt: string;
        aiMessage?: string;
    }[];
}

export interface UserXpStats {
    totalXp: number;
    level: number;
    xpToNextLevel: number;
}

export interface UserProfileResponse {
    userId: string;
    name: string;
    lastName: string;
    username: string;
    description?: string;
    picture?: string;
    sportType?: string;
    height?: number;
    currentWeight?: number;
    age?: number;
    sex?: string;
    bodyFatPercentage?: number;
    vo2max?: number;
    oneRm?: {
        squat?: number;
        bench?: number;
        deadlift?: number;
    };
    workoutsPerWeek?: number;
    achievements: UserAchievement[];
    xpStats: UserXpStats;
}

export function useUserProfile(userId?: string) {
    return useQuery<UserProfileResponse>({
        queryKey: ["user-profile", userId],
        queryFn: async () => {
            if (!userId) throw new Error("User ID is required");
            const { data } = await api.get(`/api/user-profiles/${userId}`);
            return data;
        },
        enabled: !!userId,
    });
}
