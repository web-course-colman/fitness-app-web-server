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
    id: string;
    name: string;
    description: string;
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

                        <Box sx={classes.minimizedAchievementsRow}>
                            {achievements.map((achievement) => (
                                <Tooltip key={achievement.id} title={`${achievement.name}: ${achievement.description}`}>
                                    <Avatar sx={classes.minimizedAchievementIcon}>
                                        <TrophyIcon sx={{ fontSize: '1.2rem' }} />
                                    </Avatar>
                                </Tooltip>
                            ))}
                        </Box>
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
