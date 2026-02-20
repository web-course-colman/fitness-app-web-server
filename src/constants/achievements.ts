export const ACHIEVEMENT_ICON_BY_NAME: Record<string, string> = {
  "First Steps": "/first-steps.png",
  "Workout Streak": "/workout-streak.png",
  "Volume King": "/volume-king.png",
  "Pain Free": "/pain-free.png",
  "Early Bird": "/early-bird.png",
  "AI Focused": "/ai-focused.png",
  "Consistency Master": "/consistency-master.png",
};

export const TIER_ORDER = ["bronze", "silver", "gold", "diamond"] as const;

export const TIER_COLOR_BY_LEVEL: Record<string, string> = {
  bronze: "#cd7f32",
  silver: "#94a3b8",
  gold: "#f59e0b",
  diamond: "#06b6d4",
};

export const ACHIEVEMENT_RULE_BY_NAME: Record<string, string> = {
  "First Steps":
    "Counts workout posts that include activity details (type, duration, calories, feelings, or goals).",
  "Volume King": "Counts total workout duration from all valid workout posts.",
  "Workout Streak": "Uses your current consecutive-day workout streak value.",
  "Pain Free":
    "Counts workout posts that do not include pain-related keywords in title/description/feelings.",
  "Early Bird":
    "Counts workouts posted between 05:00 and 07:59 (post creation time).",
  "Consistency Master":
    "Counts consecutive qualified weeks where you posted at least 4 workouts in each week.",
  "AI Focused": "Counts AI coach tip requests.",
};

export function formatAchievementTierRequirement(
  achievementName: string,
  value: number,
): string {
  switch (achievementName) {
    case "First Steps":
      return `${value} activity post${value === 1 ? "" : "s"}`;
    case "Volume King":
      return `${value} total workout duration`;
    case "Workout Streak":
      return `${value}-day streak`;
    case "Pain Free":
      return `${value} pain-free workout post${value === 1 ? "" : "s"}`;
    case "Early Bird":
      return `${value} early workouts (05:00-07:59)`;
    case "Consistency Master":
      return `${value} consecutive qualified week${value === 1 ? "" : "s"} (4+ workouts/week)`;
    case "AI Focused":
      return `${value} AI coach tip request${value === 1 ? "" : "s"}`;
    default:
      return `${value} progress`;
  }
}

export function getAchievementShareCopy(
  achievementName: string,
  tier: string,
): { title: string; description: string } {
  const normalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);

  return {
    title: `${normalizedTier} ${achievementName} unlocked`,
    description: `I just unlocked ${normalizedTier} tier in ${achievementName}. Staying consistent and pushing forward.`,
  };
}
