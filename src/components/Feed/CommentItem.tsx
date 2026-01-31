import { Box, Avatar, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Comment } from "../../hooks/usePosts";

interface CommentItemProps {
    comment: Comment;
    classes: any;
}

const CommentItem = ({ comment, classes }: CommentItemProps) => {
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
        <Box sx={classes.commentItem}>
            <Avatar
                src={comment.author?.picture || undefined}
                sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
            >
                {getInitials(comment.author ? `${comment.author.name} ${comment.author.lastName}` : null)}
            </Avatar>
            <Box sx={classes.commentContent}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                        {comment.author ? `${comment.author.name} ${comment.author.lastName}` : "Anonymous"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {formatDate(comment.createdAt)}
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {comment.content}
                </Typography>
            </Box>
        </Box>
    );
};

export default CommentItem;
