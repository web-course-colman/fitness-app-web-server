import { Box, Avatar, Typography, IconButton, TextField, Button } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Check as SaveIcon, Close as CancelIcon } from "@mui/icons-material";
import { useAuth } from "../Auth/AuthProvider";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Comment, useDeleteComment, useUpdateComment } from "../../hooks/usePosts";

interface CommentItemProps {
  comment: Comment;
  classes: any;
  postId: string;
}

const CommentItem = ({ comment, classes, postId }: CommentItemProps) => {
  const { loggedUser } = useAuth();
  const deleteCommentMutation = useDeleteComment();
  const updateCommentMutation = useUpdateComment();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

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

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    try {
      await updateCommentMutation.mutateAsync({
        postId,
        commentId: comment._id,
        content: editContent,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
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
        {isEditing ? (
          <Box sx={{ width: "100%", mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              multiline
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: "0.8125rem",
                  bgcolor: "background.paper"
                }
              }}
            />
            <Box sx={{ display: "flex", gap: 1, mt: 0.5, justifyContent: "flex-end" }}>
              <IconButton size="small" onClick={() => setIsEditing(false)} color="inherit">
                <CancelIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleUpdate}
                color="primary"
                disabled={updateCommentMutation.isPending}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8125rem", lineHeight: 1.2 }}
          >
            {comment.content}
          </Typography>
        )}
      </Box>
      {
        isAuthor && !isEditing && (
          <Box sx={{ display: 'flex', ml: "auto", alignSelf: "start" }}>
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              sx={{ p: 0.5 }}
            >
              <EditIcon fontSize="small" sx={{ fontSize: "1rem" }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDelete}
              disabled={deleteCommentMutation.isPending}
              sx={{ p: 0.5 }}
            >
              <DeleteIcon fontSize="small" sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Box>
        )
      }
    </Box >
  );
};

export default CommentItem;
