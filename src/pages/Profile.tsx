import { Box, Typography, CircularProgress } from "@mui/material";
import { LocalFireDepartment as FireIcon, FitnessCenter as WorkoutIcon, EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useEffect, useMemo, useRef } from "react";
import { useStyles } from "./Profile.styles";
import ProfileHeader from "../components/Profile/ProfileHeader";
import { useAuth } from "../components/Auth/AuthProvider";
import { useAuthorPostsInfinite } from "../hooks/usePosts";
import { useUserProfile } from "../hooks/useUserProfile";
import PostCard from "../components/Feed/PostCard";

const Profile = () => {
    const classes = useStyles();
    const { loggedUser } = useAuth();
    const { data: profileData, isLoading: isProfileLoading } = useUserProfile(loggedUser?.userId);

    const limit = 3;
    const userId = loggedUser?.userId;

    const {
        data: infinite,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useAuthorPostsInfinite(userId, {
        limit,
        enabled: !!userId,
    });

    const posts = useMemo(() => {
        return infinite?.pages.flatMap((p) => p.items) ?? [];
    }, [infinite]);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!userId) return;
        if (!loadMoreRef.current) return;

        const el = loadMoreRef.current;
        const scrollRoot = document.getElementById("app-scroll-container");

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (!first?.isIntersecting) return;
                if (!hasNextPage) return;
                if (isFetchingNextPage) return;
                fetchNextPage();
            },
            {
                root: scrollRoot,
                rootMargin: "800px",
                threshold: 0,
            },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, userId]);

    const user = {
        name: `${loggedUser?.name || ""} ${loggedUser?.lastName || ""}`.trim() || "User",
        handle: `@${loggedUser?.username || "user"}`,
        bio: loggedUser?.description || "No bio yet",
        avatarUrl: loggedUser?.picture || "",
        initials: loggedUser?.name ? loggedUser.name.charAt(0).toUpperCase() : "U"
    };

    const stats = [
        { label: "Streak", value: `${loggedUser?.streak || 0} days`, icon: <FireIcon /> },
        {
            label: "Workouts",
            value: loggedUser?.postsCount ?? 0,
            icon: <WorkoutIcon />
        },
        {
            label: "XP",
            value: profileData?.xpStats.totalXp ?? 0,
            icon: <TrophyIcon />
        },
        {
            label: "Level",
            value: profileData?.xpStats.level ?? 1,
            icon: <TrophyIcon />
        }
    ];

    const realAchievements = profileData?.achievements || [];

    return (
        <Box sx={classes.container}>
            <ProfileHeader
                name={user.name}
                handle={user.handle}
                bio={user.bio}
                avatarUrl={user.avatarUrl}
                initials={user.initials}
                stats={stats}
                achievements={realAchievements}
            />

            <Box sx={classes.postsSection}>
                <Typography sx={classes.postsTitle}>
                    Your Workouts
                </Typography>
                <Box sx={classes.postsGrid}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress size={30} />
                        </Box>
                    ) : (
                        <>
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} isProfile={true} />
                            ))}
                            {posts.length === 0 && (
                                <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                                    You haven't posted anything yet.
                                </Typography>
                            )}

                            {posts.length > 0 && (
                                <>
                                    <Box ref={loadMoreRef} sx={classes.infiniteSentinel} />
                                    {isFetchingNextPage && (
                                        <Box sx={classes.infiniteLoaderContainer}>
                                            <CircularProgress size={26} />
                                        </Box>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};


export default Profile;
