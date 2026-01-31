import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import {
    Settings as SettingsIcon,
    LocalFireDepartment as FireIcon,
    FitnessCenter as WorkoutIcon,
    ChatBubbleOutline as PostIcon
} from "@mui/icons-material";
import { useStyles } from "./Profile.styles";
import ProfileHeader from "../components/Profile/ProfileHeader";
import { useAuth } from "../components/Auth/AuthProvider";
import { useUserPosts } from "../hooks/usePosts";
import PostCard from "../components/Feed/PostCard";

const Profile = () => {
    const classes = useStyles();
    const { loggedUser } = useAuth();
    const { data: posts, isLoading } = useUserPosts();

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
        { label: "Posts", value: isLoading ? "..." : (posts?.length || 0), icon: <PostIcon /> },
    ];

    const achievements = [
        { id: "1", name: "Early Bird", description: "Complete 10 morning workouts" },
        { id: "2", name: "Iron Will", description: "30-day workout streak" },
        { id: "3", name: "Calorie Crusher", description: "Burn 10,000 total calories" },
        { id: "4", name: "Consistent", description: "Complete 50 workouts" },
    ];

    return (
        <Box sx={classes.container}>
            <ProfileHeader
                name={user.name}
                handle={user.handle}
                bio={user.bio}
                avatarUrl={user.avatarUrl}
                initials={user.initials}
                stats={stats}
                achievements={achievements}
            />

            <Box sx={classes.postsSection}>
                <Typography sx={classes.postsTitle}>
                    Your Posts
                </Typography>
                <Box sx={classes.postsGrid}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress size={30} />
                        </Box>
                    ) : (
                        <>
                            {posts?.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                            {posts?.length === 0 && (
                                <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                                    You haven't posted anything yet.
                                </Typography>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};


export default Profile;
