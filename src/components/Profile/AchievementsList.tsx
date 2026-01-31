import { Box, Typography, Avatar } from "@mui/material";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useStyles } from "../../pages/Profile.styles";

interface Achievement {
    id: string;
    name: string;
    description: string;
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
                {achievements.map((achievement) => (
                    <Box key={achievement.id} sx={classes.achievementItem}>
                        <Avatar sx={classes.achievementIcon}>
                            <TrophyIcon />
                        </Avatar>
                        <Box sx={classes.achievementInfo}>
                            <Typography variant="body1" sx={classes.achievementName}>
                                {achievement.name}
                            </Typography>
                            <Typography variant="body2" sx={classes.achievementDescription}>
                                {achievement.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default AchievementsList;
