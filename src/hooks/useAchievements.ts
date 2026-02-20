import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";

export interface AchievementTier {
  level: string;
  value: number;
}

export interface UserAchievementProgress {
  achievementId: string;
  achievement: {
    name: string;
    description: string;
    category: string;
    icon: string;
    tiers: AchievementTier[];
  };
  currentTier: "none" | "bronze" | "silver" | "gold" | "diamond";
  progressValue: number;
}

export function useMyAchievements(enabled = true) {
  return useQuery<UserAchievementProgress[]>({
    queryKey: ["achievements", "me"],
    queryFn: async () => {
      const { data } = await api.get("/api/achievements/me");
      return data;
    },
    enabled,
  });
}
