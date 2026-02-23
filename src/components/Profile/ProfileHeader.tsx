import {
  Box,
  Avatar,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Edit as EditIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import {
  useStyles,
  getTierColor,
  getMinimizedAchievementAvatarSx,
  getMinimizedAchievementTrophyIconSx,
} from "../../pages/Profile/Profile.styles";

interface Stat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

interface Achievement {
  achievementId: string;
  achievement: {
    name: string;
    description: string;
    icon: string;
  };
  currentTier: string;
}

interface ProfileHeaderProps {
  name: string;
  handle: string;
  bio: string;
  avatarUrl?: string;
  initials: string;
  stats: Stat[];
  achievements: Achievement[];
}

const ProfileHeader = ({
  name,
  handle,
  bio,
  avatarUrl,
  initials,
  stats,
  achievements,
}: ProfileHeaderProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Box sx={classes.profileCard}>
      <Box sx={classes.userInfo}>
        <Box sx={classes.userInfoMain}>
          <Avatar src={avatarUrl} sx={classes.avatar}>
            {initials}
          </Avatar>
          <Box sx={classes.details}>
            <Typography variant="h5" sx={classes.userName}>
              {name}
            </Typography>
            <Typography variant="body1" sx={classes.userHandle}>
              {handle}
            </Typography>
            <Typography variant="body2" sx={classes.bio}>
              {bio}
            </Typography>
          </Box>
        </Box>
        <Box sx={classes.minimizedStatsRow}>
          {stats.map((stat, index) => (
            <Box key={index} sx={classes.minimizedStatItem}>
              <Typography sx={classes.minimizedStatValue}>{stat.value}</Typography>
              <Typography sx={classes.minimizedStatLabel}>{stat.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={classes.minimizedAchievementsRow}>
        {achievements.map((ua) => {
          const isLocked = ua.currentTier === "none";
          const tierColor = getTierColor(ua.currentTier);

          return (
            <Tooltip
              key={ua.achievementId?.toString() || Math.random()}
              title={
                ua.achievement
                  ? `${ua.achievement.name} (${ua.currentTier}): ${ua.achievement.description}`
                  : "Unknown Achievement"
              }
            >
              <Avatar
                src={ua.achievement?.icon}
                sx={getMinimizedAchievementAvatarSx(
                  classes.minimizedAchievementIcon,
                  tierColor,
                  isLocked
                )}
              >
                <TrophyIcon
                  sx={getMinimizedAchievementTrophyIconSx(
                    ua.currentTier,
                    isLocked
                  )}
                />
              </Avatar>
            </Tooltip>
          );
        })}
      </Box>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<EditIcon />}
        sx={classes.editButton}
        onClick={() => navigate("/edit-profile")}
      >
        Edit Profile
      </Button>
    </Box>
  );
};

export default ProfileHeader;
