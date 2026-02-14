import { Box, Card, Avatar, Typography, Button, Tooltip, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit as EditIcon, EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useStyles } from "../../pages/Profile.styles";

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

const ProfileHeader = ({ name, handle, bio, avatarUrl, initials, stats, achievements }: ProfileHeaderProps) => {
    const classes = useStyles();
    const navigate = useNavigate();

    return (
        <Box sx={classes.profileCard}>
            <Box sx={classes.userInfo}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3, width: { xs: '100%', md: 'auto' } }}>
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
                        <>
                            <Box key={index} sx={classes.minimizedStatItem}>
                                <Typography sx={classes.minimizedStatValue}>
                                    {stat.value}
                                </Typography>
                                <Typography sx={classes.minimizedStatLabel}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        </>
                    ))}
                </Box>
            </Box>
            <Box sx={classes.minimizedAchievementsRow}>
                {achievements.map((ua) => {
                    const isLocked = ua.currentTier === 'none';
                    const tierColor =
                        ua.currentTier === 'diamond' ? '#b9f2ff' :
                            ua.currentTier === 'gold' ? '#ffd700' :
                                ua.currentTier === 'silver' ? '#c0c0c0' :
                                    ua.currentTier === 'bronze' ? '#cd7f32' : '#9ca3af';

                    return (
                        <Tooltip
                            key={ua.achievementId?.toString() || Math.random()}
                            title={ua.achievement ? `${ua.achievement.name} (${ua.currentTier}): ${ua.achievement.description}` : 'Unknown Achievement'}
                        >
                            <Avatar
                                src={ua.achievement?.icon}
                                sx={{
                                    ...classes.minimizedAchievementIcon,
                                    bgcolor: isLocked ? '#f3f4f6' : tierColor,
                                    border: 'none',
                                    filter: isLocked ? 'grayscale(100%)' : 'none',
                                    opacity: isLocked ? 0.4 : 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    animation: isLocked ? 'none' : 'sparkle 3s infinite ease-in-out',
                                    boxShadow: isLocked ? 'none' : `0 0 15px ${tierColor}66`,
                                    '&::after': isLocked ? {} : {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                        animation: 'shimmer 4s infinite linear',
                                    },
                                    '& img': {
                                        filter: isLocked ? 'grayscale(100%)' : `drop-shadow(0 2px 4px rgba(0,0,0,0.3)) contrast(1.1)`,
                                        objectFit: 'contain',
                                        padding: '4px',
                                    },
                                    '&:hover': {
                                        transform: isLocked ? 'none' : 'scale(1.15)',
                                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        boxShadow: isLocked ? 'none' : `0 0 25px ${tierColor}`,
                                    },
                                }}
                            >
                                <TrophyIcon sx={{
                                    fontSize: '1.2rem',
                                    color: isLocked || ua.currentTier === 'bronze' ? 'white' : 'rgba(0,0,0,0.8)',
                                    stroke: isLocked || ua.currentTier === 'bronze' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                                    strokeWidth: 0.5,
                                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} />
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
                onClick={() => navigate('/edit-profile')}
            >
                Edit Profile
            </Button>
        </Box>
    );
};

export default ProfileHeader;
