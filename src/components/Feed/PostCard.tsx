import { useCallback, useEffect, useState } from "react";
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
} from "@mui/material";
import {
  Favorite,
  ChatBubbleOutline,
  Share as ShareIcon,
  FavoriteBorder,
  Send,
  Edit,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { useStyles } from "../../pages/Feed.styles";
import { Post, useAddComment, useLikePost } from "@/hooks/usePosts";
import PostImages from "./PostImages";
import PostWorkoutDetails from "./PostWorkoutDetails";
import api from "@/services/axios";
import { useAuth } from "../Auth/AuthProvider";
import CommentItem from "./CommentItem";
import EditPostModal from "./EditPostModal";

interface PostCardProps {
  post: Post;
  isProfile?: boolean;
}

const PostCard = ({ post, isProfile = false }: PostCardProps) => {
  const classes = useStyles();
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
  const [displayCount, setDisplayCount] = useState(2);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const addCommentMutation = useAddComment();
  const likePostMutation = useLikePost();

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
    setDisplayCount((prev) => prev + 5);
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
            <IconButton onClick={() => setEditModalOpen(true)} size="small">
              <Edit />
            </IconButton>
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
                onClick={() => setShowComments(!showComments)}
              >
                {comments.length}
              </Button>
              <Button
                variant="text"
                size="small"
                startIcon={<ShareIcon />}
                sx={classes.actionButton}
              />
            </Box>
          </Box>

          {showComments && (
            <Box sx={classes.commentsSection}>
              {visibleComments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  classes={classes}
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
    </Card>
  );
};

export default PostCard;
