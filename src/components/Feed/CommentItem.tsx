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
                sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: "0.75rem" }}
            >
                {getInitials(comment.author ? `${comment.author.name} ${comment.author.lastName}` : null)}
            </Avatar>
            <Box sx={classes.commentContent}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.8 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {comment.author ? `${comment.author.name} ${comment.author.lastName}` : "Anonymous"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem" }}>
                        {formatDate(comment.createdAt)}
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: "0.8125rem", lineHeight: 1.2 }}>
                    {comment.content}
                </Typography>
            </Box>
        </Box>
    );
};

export default CommentItem;
