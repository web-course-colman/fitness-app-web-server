import { Box, Avatar, Typography, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useAuth } from "../Auth/AuthProvider";
import { formatDistanceToNow } from "date-fns";
import { Comment, useDeleteComment } from "../../hooks/usePosts";

interface CommentItemProps {
  comment: Comment;
  classes: any;
  postId: string;
}

const CommentItem = ({ comment, classes, postId }: CommentItemProps) => {
  const { loggedUser } = useAuth();
  const deleteCommentMutation = useDeleteComment();

  const isAuthor = loggedUser?.userId === comment.author._id;

  const handleDelete = async () => {
    try {
      await deleteCommentMutation.mutateAsync({
        postId,
        commentId: comment._id,
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
        sx={{
          width: 28,
          height: 28,
          background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
          fontSize: "0.75rem",
        }}
      >
        {getInitials(
          comment.author
            ? `${comment.author.name} ${comment.author.lastName}`
            : null
        )}
      </Avatar>
      <Box sx={classes.commentContent}>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.8 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {comment.author
              ? `${comment.author.name} ${comment.author.lastName}`
              : "Anonymous"}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontSize: "0.65rem" }}
          >
            {formatDate(comment.createdAt)}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ fontSize: "0.8125rem", lineHeight: 1.2 }}
        >
          {comment.content}
        </Typography>
      </Box>
      {isAuthor && (
        <IconButton
          size="small"
          onClick={handleDelete}
          disabled={deleteCommentMutation.isPending}
          sx={{ ml: "auto", alignSelf: "start", p: 0.5 }}
        >
          <DeleteIcon fontSize="small" sx={{ fontSize: "1rem" }} />
        </IconButton>
      )}
    </Box>
  );
};

export default CommentItem;
