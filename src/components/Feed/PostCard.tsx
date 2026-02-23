import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Favorite,
  ChatBubbleOutline,
  FavoriteBorder,
  Send,
  Edit,
  MoreVert,
  Delete,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { useStyles } from "../../pages/Feed/Feed.styles";
import { Post, useAddComment, useLikePost, useDeletePost } from "@/hooks/usePosts";
import PostImages from "./PostImages";
import PostWorkoutDetails from "./PostWorkoutDetails";
import api from "@/services/axios";
import { useAuth } from "../Auth/AuthProvider";
import CommentItem from "./CommentItem";
import EditPostModal from "./EditPostModal";

interface PostCardProps {
  post: Post;
  isProfile?: boolean;
  isDetailsPage?: boolean;
}

const PostCard = ({ post, isProfile = false, isDetailsPage = false }: PostCardProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { loggedUser } = useAuth();
  const [postLikes, setPostLikes] = useState<number>(post.likeNumber);
  const [isLikedByUser, setIsLiked] = useState<boolean>(
    !!post.likes?.find((like) => like.username === loggedUser?.username)
  );

  useEffect(() => {
    setPostLikes(post.likeNumber);
    setIsLiked(
      !!post.likes?.find((like) => like.username === loggedUser?.username)
    );
  }, [post.likeNumber, post.likes, loggedUser?.username]);

  const [showComments, setShowComments] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  // On details page, show all comments (or a large number) by default
  const [displayCount, setDisplayCount] = useState(isDetailsPage ? 100 : 2);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const addCommentMutation = useAddComment();
  const likePostMutation = useLikePost();
  const deletePostMutation = useDeletePost();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false);
    try {
      await deletePostMutation.mutateAsync(post._id);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleLikePost = useCallback(async () => {
    if (likePostMutation.isPending) return;
    try {
      await likePostMutation.mutateAsync(post._id);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  }, [post._id, likePostMutation]);

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

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    try {
      await addCommentMutation.mutateAsync({
        postId: post._id,
        content: commentContent,
      });
      setCommentContent("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleLoadMore = () => {
    if (!isDetailsPage) {
      navigate(`/posts/${post._id}`);
    } else {
      setDisplayCount((prev) => prev + 5);
    }
  };

  const comments = post.comments || [];
  const visibleComments = comments.slice(0, displayCount);
  const hasMoreComments = comments.length > displayCount;

  const isAuthor = loggedUser?.userId === post.author._id;

  return (
    <Card elevation={1} sx={classes.card}>
      <CardHeader
        avatar={
          <Avatar
            src={post.author?.picture || undefined}
            sx={{
              background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
            }}
          >
            {getInitials(
              post.author ? `${post.author.name} ${post.author.lastName}` : null
            )}
          </Avatar>
        }
        action={
          isProfile && isAuthor ? (
            <>
              <IconButton onClick={handleMenuClick} size="small">
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { handleMenuClose(); setEditModalOpen(true); }}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                  <ListItemIcon>
                    <Delete fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : null
        }
        title={
          <Typography variant="subtitle1" sx={classes.authorName}>
            {post.author
              ? `${post.author.name} ${post.author.lastName}`
              : "Anonymous"}
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

          <PostImages src={post.src} pictures={post.pictures || []} />

          <PostWorkoutDetails
            type={post.workoutDetails?.type}
            duration={post.workoutDetails?.duration}
            calories={post.workoutDetails?.calories}
          />

          <Box sx={classes.actionsContainer}>
            <Box sx={classes.actionButtons}>
              <Button
                size="small"
                startIcon={isLikedByUser ? <Favorite /> : <FavoriteBorder />}
                sx={classes.actionButton}
                onClick={handleLikePost}
              >
                {postLikes}
              </Button>
              <Button
                variant="text"
                size="small"
                startIcon={<ChatBubbleOutline />}
                sx={classes.actionButton}
                onClick={() => {
                  if (isDetailsPage) {
                    setShowComments(!showComments);
                  } else {
                    navigate(`/posts/${post._id}`);
                  }
                }}
              >
                {post.commentsNumber ?? comments.length}
              </Button>
            </Box>
          </Box>

          {isDetailsPage && showComments && (
            <Box sx={classes.commentsSection}>
              {visibleComments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  classes={classes}
                  postId={post._id}
                />
              ))}

              {(hasMoreComments || displayCount > 2) && (
                <Box sx={classes.commentsPagination}>
                  {hasMoreComments && (
                    <Button
                      onClick={handleLoadMore}
                      sx={classes.loadMoreButton}
                      disableRipple
                    >
                      Load more
                    </Button>
                  )}

                  {displayCount > 2 && (
                    <Button
                      onClick={() => setDisplayCount(2)}
                      sx={classes.loadMoreButton}
                      disableRipple
                    >
                      Show less
                    </Button>
                  )}
                </Box>
              )}

              <Box sx={classes.commentInputContainer}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write a comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment();
                    }
                  }}
                  sx={classes.commentInput}
                />
                <IconButton
                  color="primary"
                  onClick={handleAddComment}
                  disabled={
                    !commentContent.trim() || addCommentMutation.isPending
                  }
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
      <EditPostModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        post={post}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostCard;
