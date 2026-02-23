import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useMyAchievements } from "@/hooks/useAchievements";
import { useStyles } from "./Achievements.styles";
import {
  ACHIEVEMENT_RULE_BY_NAME,
  formatAchievementTierRequirement,
  TIER_COLOR_BY_LEVEL,
  TIER_ORDER,
} from "@/constants/achievements";

const Achievements = () => {
  const classes = useStyles();
  const { data, isLoading } = useMyAchievements(true);

  if (isLoading) {
    return (
      <Box sx={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={classes.container}>
      <Typography variant="body1" color="text.secondary" sx={classes.subtitle}>
        Track every achievement and see exactly what is required for each tier.
      </Typography>
      <Box sx={classes.cardsContainer}>
        {(data || []).map((item) => {
          const tiersSorted = [...(item.achievement.tiers || [])].sort(
            (a, b) =>
              TIER_ORDER.indexOf(a.level as (typeof TIER_ORDER)[number]) -
              TIER_ORDER.indexOf(b.level as (typeof TIER_ORDER)[number]),
          );
          const upcomingTier =
            tiersSorted.find((tier) => item.progressValue < tier.value) || null;
          const progressPercent = upcomingTier
            ? Math.min(
                100,
                Math.round((item.progressValue / upcomingTier.value) * 100),
              )
            : 100;

          return (
            <Box key={item.achievementId} sx={classes.cardItem}>
              <Box sx={classes.cardWrapper}>
                <Card sx={classes.card}>
                  <CardContent sx={classes.cardContent}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      mb={1.5}
                    >
                      <Box
                        component="img"
                        src={item.achievement.icon}
                        alt={item.achievement.name}
                        sx={classes.icon}
                      />
                      <Box sx={classes.achievementHeaderText}>
                        <Typography variant="h6" sx={classes.achievementName}>
                          {item.achievement.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={
                            item.currentTier === "none"
                              ? "Locked"
                              : `Current: ${item.currentTier}`
                          }
                          sx={{
                            ...classes.tierChip,
                            bgcolor:
                              item.currentTier === "none"
                                ? "action.hover"
                                : TIER_COLOR_BY_LEVEL[item.currentTier] ||
                                  "action.hover",
                            color:
                              item.currentTier === "gold" ? "#111827" : "#fff",
                          }}
                        />
                      </Box>
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={classes.description}
                    >
                      {item.achievement.description}
                    </Typography>
                    <Typography variant="caption" sx={classes.ruleText}>
                      {ACHIEVEMENT_RULE_BY_NAME[item.achievement.name] ||
                        "Complete the required progress to unlock tiers."}
                    </Typography>

                    <Typography variant="caption" sx={classes.progressText}>
                      Progress: {item.progressValue}
                      {upcomingTier
                        ? ` (next: ${upcomingTier.level} at ${upcomingTier.value})`
                        : " (max tier reached)"}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercent}
                      sx={classes.progressBar}
                    />

                    <Stack spacing={0.8} sx={classes.tiersStack}>
                      {tiersSorted.map((tier) => (
                        <Typography
                          key={`${item.achievementId}-${tier.level}`}
                          variant="body2"
                          sx={{
                            ...classes.tierText,
                            color:
                              TIER_COLOR_BY_LEVEL[tier.level] || "text.primary",
                          }}
                        >
                          {tier.level}:{" "}
                          {formatAchievementTierRequirement(
                            item.achievement.name,
                            tier.value,
                          )}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Achievements;
