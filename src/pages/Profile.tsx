import { Box, Typography, IconButton } from "@mui/material";
import {
    Settings as SettingsIcon,
    LocalFireDepartment as FireIcon,
    FitnessCenter as WorkoutIcon,
    ChatBubbleOutline as PostIcon
} from "@mui/icons-material";
import { useStyles } from "./Profile.styles";
import ProfileHeader from "../components/Profile/ProfileHeader";
import StatsCard from "../components/Profile/StatsCard";
import AchievementsList from "../components/Profile/AchievementsList";
import { useAuth } from "../components/Auth/AuthProvider";
import { useUserPosts } from "../hooks/usePosts";

const Profile = () => {
    const classes = useStyles();
    const { loggedUser } = useAuth();
    const { data: posts } = useUserPosts();

    const user = {
        name: `${loggedUser?.name || ""} ${loggedUser?.lastName || ""}`.trim() || "User",
        handle: `@${loggedUser?.username || "user"}`,
        bio: "Fitness enthusiast | Building strength 💪",
        avatarUrl: loggedUser?.picture || "",
        initials: loggedUser?.name ? loggedUser.name.charAt(0).toUpperCase() : "U"
    };

    const stats = [
        { label: "Workouts", value: 0, icon: <WorkoutIcon /> },
        { label: "Streak", value: "0 days", icon: <FireIcon /> },
        { label: "Posts", value: posts?.length || 0, icon: <PostIcon /> },
    ];

    const achievements = [
        { id: "1", name: "Early Bird", description: "Complete 10 morning workouts" },
        { id: "2", name: "Iron Will", description: "30-day workout streak" },
        { id: "3", name: "Calorie Crusher", description: "Burn 10,000 total calories" },
        { id: "4", name: "Consistent", description: "Complete 50 workouts" },
    ];

    return (
        <Box sx={classes.container}>
            <Box sx={classes.headerContainer}>
                <Typography variant="h4" fontWeight="bold">
                    Profile
                </Typography>
            </Box>

            <ProfileHeader
                name={user.name}
                handle={user.handle}
                bio={user.bio}
                avatarUrl={user.avatarUrl}
                initials={user.initials}
            />

            <Box sx={classes.statsRow}>
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                    />
                ))}
            </Box>

            <AchievementsList achievements={achievements} />
        </Box>
    );
};


export default Profile;
