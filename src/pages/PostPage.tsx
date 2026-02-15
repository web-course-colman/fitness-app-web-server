import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { usePost } from "@/hooks/usePosts";
import PostCard from "@/components/Feed/PostCard";

import { useStyles } from "./Feed.styles";

const PostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const classes = useStyles();
    const { data: post, isLoading, error } = usePost(postId || "");

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !post) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="error">
                    Post not found
                </Typography>
                <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={classes.container}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} edge="start" size="small" sx={{ mr: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" fontWeight="bold">
                    Post
                </Typography>
            </Box>
            <Box sx={classes.postsContainer}>
                <PostCard post={post} isDetailsPage={true} />
            </Box>
        </Box>
    );
};

export default PostPage;
