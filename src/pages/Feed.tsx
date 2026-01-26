import {
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import { usePosts } from "@/hooks/usePosts";
import { useStyles } from "./Feed.styles";
import PostCard from "@/components/Feed/PostCard";

const Feed = () => {
    const classes = useStyles();
    const { data: posts, isLoading, error } = usePosts();

    return (
        <Box sx={classes.container}>
            {/* Page Title */}
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Feed
            </Typography>

            {/* Posts */}
            <Box sx={classes.postsContainer}>
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
                        <PostCard key={post._id} post={post} />
                    ))
                )}
            </Box>
        </Box>
    );
};

export default Feed;
