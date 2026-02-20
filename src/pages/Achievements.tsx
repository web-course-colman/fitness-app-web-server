import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useMyAchievements } from "@/hooks/useAchievements";
import {
  ACHIEVEMENT_RULE_BY_NAME,
  formatAchievementTierRequirement,
  TIER_COLOR_BY_LEVEL,
  TIER_ORDER,
} from "@/constants/achievements";

const Achievements = () => {
  const { data, isLoading } = useMyAchievements(true);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Achievements
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track every achievement and see exactly what is required for each tier.
      </Typography>

      <Grid container spacing={2}>
        {(data || []).map((item) => {
          const tiersSorted = [...(item.achievement.tiers || [])].sort(
            (a, b) =>
              TIER_ORDER.indexOf(a.level as (typeof TIER_ORDER)[number]) -
              TIER_ORDER.indexOf(b.level as (typeof TIER_ORDER)[number]),
          );
          const nextTier = tiersSorted.find(
            (tier) => item.progressValue < tier.value,
          );
          const maxTierValue = tiersSorted[tiersSorted.length - 1]?.value || 1;
          const progressPercent = Math.min(
            100,
            Math.round((item.progressValue / maxTierValue) * 100),
          );

          return (
            <Grid item xs={12} sm={6} md={4} key={item.achievementId}>
              <Card
                sx={{
                  height: "100%",
                  width: "25vw",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
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
                      sx={{ width: 44, height: 44, objectFit: "contain" }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, lineHeight: 1.2 }}
                      >
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
                          mt: 0.7,
                          textTransform: "capitalize",
                          bgcolor:
                            item.currentTier === "none"
                              ? "action.hover"
                              : TIER_COLOR_BY_LEVEL[item.currentTier] ||
                                "action.hover",
                          color:
                            item.currentTier === "gold" ? "#111827" : "#fff",
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    {item.achievement.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mb: 1.5 }}
                  >
                    {ACHIEVEMENT_RULE_BY_NAME[item.achievement.name] ||
                      "Complete the required progress to unlock tiers."}
                  </Typography>

                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Progress: {item.progressValue}
                    {nextTier
                      ? ` (next: ${nextTier.level} at ${nextTier.value})`
                      : " (max tier reached)"}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{ mt: 0.8, mb: 1.8, height: 8, borderRadius: 999 }}
                  />

                  <Stack spacing={0.8}>
                    {tiersSorted.map((tier) => (
                      <Typography
                        key={`${item.achievementId}-${tier.level}`}
                        variant="body2"
                        sx={{
                          color:
                            TIER_COLOR_BY_LEVEL[tier.level] || "text.primary",
                          fontWeight: 700,
                          textTransform: "capitalize",
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
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Achievements;
