import {
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Typography,
    Box,
    Button,
} from "@mui/material";
import { Favorite, ChatBubbleOutline, Share as ShareIcon } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { useStyles } from "../../pages/Feed.styles";
import { Post } from "@/hooks/usePosts";
import PostImages from "./PostImages";
import PostWorkoutDetails from "./PostWorkoutDetails";

interface PostCardProps {
    post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
    const classes = useStyles();

    const getInitials = (name: string | null) => {
        if (!name) return "U";
        return name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Unknown date";
        return formatDistanceToNow(date, { addSuffix: true });
    };

    return (
        <Card elevation={1} sx={classes.card}>
            <CardHeader
                avatar={
                    <Avatar
                        src={post.author?.picture || undefined}
                        sx={{ bgcolor: "primary.main" }}
                    >
                        {getInitials(post.author ? `${post.author.name} ${post.author.lastName}` : null)}
                    </Avatar>
                }
                title={
                    <Typography variant="subtitle1" sx={classes.authorName}>
                        {post.author ? `${post.author.name} ${post.author.lastName}` : "Anonymous"}
                    </Typography>
                }
                subheader={
                    <Typography variant="caption" sx={classes.timestamp}>
                        {formatDate(post.createdAt)}
                    </Typography>
                }
                sx={classes.cardHeader}
            />
            <CardContent sx={classes.cardContent}>
                <Box sx={classes.contentWrapper}>
                    <Typography variant="subtitle2" sx={classes.postTitle}>
                        {post.title}
                    </Typography>

                    {post.description && (
                        <Typography variant="body2" sx={classes.description}>
                            {post.description}
                        </Typography>
                    )}

                    <PostImages pictures={post.pictures || []} />

                    <PostWorkoutDetails
                        type={post.workoutDetails?.type}
                        duration={post.workoutDetails?.duration}
                        calories={post.workoutDetails?.calories}
                    />

                    <Box sx={classes.actionsContainer}>
                        <Box sx={classes.actionButtons}>
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<Favorite />}
                                sx={classes.actionButton}
                            >
                                0
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<ChatBubbleOutline />}
                                sx={classes.actionButton}
                            />
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<ShareIcon />}
                                sx={classes.actionButton}
                            />
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PostCard;
