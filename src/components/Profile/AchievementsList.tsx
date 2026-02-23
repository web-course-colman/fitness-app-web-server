import { Box, Typography, Avatar } from "@mui/material";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";
import {
  useStyles,
  getTierColor,
  getAchievementAvatarSx,
  getAchievementTrophyIconSx,
} from "../../pages/Profile/Profile.styles";

interface Achievement {
  achievementId: string;
  achievement: {
    name: string;
    description: string;
    icon: string;
  };
  currentTier: string;
  progressValue: number;
}

interface AchievementsListProps {
  achievements: Achievement[];
}

const AchievementsList = ({ achievements }: AchievementsListProps) => {
  const classes = useStyles();

  return (
    <Box sx={classes.achievementsSection}>
      <Typography variant="h6" sx={classes.achievementsTitle}>
        Achievements
      </Typography>
      <Box>
        {achievements.map((ua) => {
          const isLocked = ua.currentTier === "none";
          const tierColor = getTierColor(ua.currentTier);

          return (
            <Box
              key={ua.achievementId?.toString() || Math.random()}
              sx={classes.achievementItem}
            >
              <Avatar
                src={ua.achievement?.icon}
                sx={getAchievementAvatarSx(
                  classes.achievementIcon,
                  tierColor,
                  isLocked
                )}
              >
                <TrophyIcon
                  sx={getAchievementTrophyIconSx(ua.currentTier, isLocked)}
                />
              </Avatar>
              <Box sx={[classes.achievementInfo, isLocked && classes.achievementInfoLocked]}>
                <Typography variant="body1" sx={classes.achievementName}>
                  {ua.achievement?.name || "Achievement"}
                  <Typography
                    component="span"
                    sx={{ ...classes.achievementTier, color: tierColor }}
                  >
                    {ua.currentTier}
                  </Typography>
                </Typography>
                <Typography variant="body2" sx={classes.achievementDescription}>
                  {ua.achievement?.description || "No description"}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AchievementsList;
