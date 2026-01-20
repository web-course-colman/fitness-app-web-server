import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Typography,
    Button,
    CircularProgress,
} from "@mui/material";
import { Favorite, ChatBubbleOutline, Share } from "@mui/icons-material";
import { usePosts } from "@/hooks/usePosts";
import { formatDistanceToNow } from "date-fns";

const Feed = () => {
    const { data: posts, isLoading, error } = usePosts();

    const getInitials = (name: string | null) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };

    return (
        <Box>
            {/* Page Title */}
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Feed
            </Typography>

            {/* Posts */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                        <Typography>Failed to load posts</Typography>
                    </Box>
                ) : posts?.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                        <Typography>No posts yet. Be the first to share your workout!</Typography>
                    </Box>
                ) : (
                    posts?.map((post) => (
                        <Card key={post.id} elevation={1}>
                            <CardHeader
                                avatar={
                                    <Avatar
                                        src={post.profiles?.avatar_url || undefined}
                                        sx={{ bgcolor: "primary.main" }}
                                    >
                                        {getInitials(post.profiles?.full_name || null)}
                                    </Avatar>
                                }
                                title={
                                    <Typography variant="subtitle1" fontWeight="semibold">
                                        {post.profiles?.full_name || "Anonymous"}
                                    </Typography>
                                }
                                subheader={
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                    </Typography>
                                }
                                sx={{ pb: 1 }}
                            />
                            <CardContent sx={{ pt: 0, "&:last-child": { pb: 2 } }}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <Typography variant="subtitle2" fontWeight="medium">
                                        {post.title}
                                    </Typography>
                                    {post.content && (
                                        <Typography variant="body2" color="text.primary">
                                            {post.content}
                                        </Typography>
                                    )}

                                    {post.workout_type && (
                                        <Box
                                            sx={{
                                                bgcolor: "action.hover",
                                                p: 1.5,
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: post.calories_burned ? 0.5 : 0 }}>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {post.workout_type}
                                                </Typography>
                                                {post.duration_minutes && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {post.duration_minutes} min
                                                    </Typography>
                                                )}
                                            </Box>
                                            {post.calories_burned && (
                                                <Typography variant="caption" color="text.secondary">
                                                    🔥 {post.calories_burned} calories burned
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            pt: 1,
                                            borderTop: 1,
                                            borderColor: "divider",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Button
                                                variant="text"
                                                size="small"
                                                startIcon={<Favorite />}
                                                sx={{ textTransform: "none" }}
                                            >
                                                {post.likes_count}
                                            </Button>
                                            <Button
                                                variant="text"
                                                size="small"
                                                startIcon={<ChatBubbleOutline />}
                                                sx={{ textTransform: "none" }}
                                            />
                                            <Button
                                                variant="text"
                                                size="small"
                                                startIcon={<Share />}
                                                sx={{ textTransform: "none" }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default Feed;
