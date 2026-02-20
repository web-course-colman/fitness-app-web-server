export const ACHIEVEMENT_ICON_BY_NAME: Record<string, string> = {
  "First Steps": "/first-steps.png",
  "Workout Streak": "/workout-streak.png",
  "Volume King": "/volume-king.png",
  "Pain Free": "/pain-free.png",
  "Early Bird": "/early-bird.png",
  "AI Focused": "/ai-focused.png",
  "Consistency Master": "/consistency-master.png",
};

export function getAchievementShareCopy(
  achievementName: string,
  tier: string
): { title: string; description: string } {
  const normalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);

  return {
    title: `${normalizedTier} ${achievementName} unlocked`,
    description: `I just unlocked ${normalizedTier} tier in ${achievementName}. Staying consistent and pushing forward.`,
  };
}
