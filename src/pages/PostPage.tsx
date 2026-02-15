import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { usePost } from "@/hooks/usePosts";
import PostCard from "@/components/Feed/PostCard";

const PostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
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
        <Box sx={{ maxWidth: 600, mx: "auto", py: 2, px: 1 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Back
            </Button>
            <PostCard post={post} isDetailsPage={true} />
        </Box>
    );
};

export default PostPage;
