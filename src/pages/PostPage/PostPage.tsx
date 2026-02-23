import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { usePost } from "@/hooks/usePosts";
import PostCard from "@/components/Feed/PostCard";

import { useStyles } from "./PostPage.styles";

const PostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const classes = useStyles();
    const { data: post, isLoading, error } = usePost(postId || "");

    if (isLoading) {
        return (
            <Box sx={classes.loadingContainer}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !post) {
        return (
            <Box sx={classes.errorContainer}>
                <Typography variant="h6" color="error">
                    Post not found
                </Typography>
                <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={classes.errorBackButton}>
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={classes.container}>
            <Box sx={classes.header}>
                <IconButton onClick={() => navigate(-1)} edge="start" size="small" sx={classes.backIconButton}>
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
