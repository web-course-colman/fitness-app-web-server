import { Box, Typography, Avatar } from "@mui/material";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useStyles } from "../../pages/Profile.styles";

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
            <Typography variant="h6" fontWeight="bold">
                Achievements
            </Typography>
            <Box>
                {achievements.map((ua) => {
                    const isLocked = ua.currentTier === 'none';
                    const tierColor =
                        ua.currentTier === 'diamond' ? '#b9f2ff' :
                            ua.currentTier === 'gold' ? '#ffd700' :
                                ua.currentTier === 'silver' ? '#c0c0c0' :
                                    ua.currentTier === 'bronze' ? '#cd7f32' : '#9ca3af';

                    return (
                        <Box key={ua.achievementId?.toString() || Math.random()} sx={classes.achievementItem}>
                            <Avatar
                                src={ua.achievement?.icon}
                                sx={{
                                    ...classes.achievementIcon,
                                    bgcolor: isLocked ? '#f3f4f6' : tierColor,
                                    border: 'none',
                                    filter: isLocked ? 'grayscale(100%)' : 'none',
                                    opacity: isLocked ? 0.5 : 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    animation: isLocked ? 'none' : 'sparkle 4s infinite ease-in-out',
                                    boxShadow: isLocked ? 'none' : `0 0 20px ${tierColor}44`,
                                    '&::after': isLocked ? {} : {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                        animation: 'shimmer 3s infinite linear',
                                    },
                                    '& img': {
                                        filter: isLocked ? 'grayscale(100%)' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.4)) contrast(1.2)',
                                        transform: 'scale(0.85)',
                                    },
                                }}
                            >
                                <TrophyIcon sx={{
                                    color: isLocked || ua.currentTier === 'bronze' ? 'white' : 'rgba(0,0,0,0.8)',
                                    stroke: isLocked || ua.currentTier === 'bronze' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                                    strokeWidth: 0.8,
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                }} />
                            </Avatar>
                            <Box sx={{ ...classes.achievementInfo, opacity: isLocked ? 0.6 : 1 }}>
                                <Typography variant="body1" sx={classes.achievementName}>
                                    {ua.achievement?.name || 'Achievement'}
                                    <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: tierColor, ml: 1 }}>
                                        {ua.currentTier}
                                    </Typography>
                                </Typography>
                                <Typography variant="body2" sx={classes.achievementDescription}>
                                    {ua.achievement?.description || 'No description'}
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
