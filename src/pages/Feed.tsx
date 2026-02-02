import {
    Box,
    Typography,
    CircularProgress,
    Chip,
    IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { usePosts } from "@/hooks/usePosts";
import { useStyles } from "./Feed.styles";
import PostCard from "@/components/Feed/PostCard";
import { useSearchParams } from "react-router-dom";

const Feed = () => {
    const classes = useStyles();
    const [searchParams, setSearchParams] = useSearchParams();
    const authorId = searchParams.get("authorId");
    const authorName = searchParams.get("authorName");

    const { data: posts, isLoading, error } = usePosts(authorId || undefined);

    const clearFilter = () => {
        setSearchParams({});
    };

    return (
        <Box sx={classes.container}>
            {authorId && (
                <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Showing posts by:
                    </Typography>
                    <Chip
                        label={authorName || "User"}
                        onDelete={clearFilter}
                        color="primary"
                        variant="outlined"
                        deleteIcon={<CloseIcon />}
                    />
                </Box>
            )}
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
