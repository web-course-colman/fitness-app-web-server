import { useState, useRef } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { ArrowBack, Send } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./WorkoutPost.styles";
import { useCreatePost } from "../hooks/usePosts";
import { useToast } from "../hooks/use-toast";
import PhotoUploadArea from "@/components/Workouts/PhotoUploadArea";
import WorkoutDetailsSection from "@/components/Workouts/WorkoutDetailsSection";

const WorkoutPost = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createPost = useCreatePost();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [subjectiveFeedbackFeelings, setSubjectiveFeedbackFeelings] =
    useState("");
  const [personalGoals, setPersonalGoals] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleShare = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      title,
      description,
      pictures: imagePreviews,
      workoutDetails: {
        type: workoutType || undefined,
        duration: duration ? parseInt(duration) : undefined,
        calories: calories ? parseInt(calories) : undefined,
        subjectiveFeedbackFeelings:
          subjectiveFeedbackFeelings.trim() || undefined,
        personalGoals: personalGoals.trim() || undefined,
      },
    };

    createPost.mutate(postData, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Workout posted successfully!",
        });
        navigate("/feed");
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to post workout",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Box sx={styles.container}>
      <input
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Header */}
      <Box sx={styles.header}>
        <Box sx={styles.headerLeft}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={styles.title}>
            New Post
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={styles.shareButton}
          startIcon={<Send />}
          onClick={handleShare}
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Sharing..." : "Share"}
        </Button>
      </Box>

      {/* Content Inputs */}
      <Box sx={styles.menuContainer}>
        <Box sx={styles.workoutDetailsBox}>
          <Box sx={styles.inputSection}>
            <Typography sx={styles.label}>Title</Typography>
            <TextField
              fullWidth
              placeholder="What's your workout about?"
              variant="outlined"
              sx={styles.textField}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>

          <Box sx={styles.inputSection}>
            <Typography sx={styles.label}>Description (optional)</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Share your workout experience, progress, or motivation..."
              variant="outlined"
              sx={styles.textField}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          <PhotoUploadArea
            imagePreviews={imagePreviews}
            onPhotoClick={handlePhotoClick}
            onRemovePhoto={handleRemovePhoto}
          />
        </Box>
        <WorkoutDetailsSection
          workoutType={workoutType}
          duration={duration}
          calories={calories}
          subjectiveFeedbackFeelings={subjectiveFeedbackFeelings}
          personalGoals={personalGoals}
          onWorkoutTypeChange={setWorkoutType}
          onDurationChange={setDuration}
          onCaloriesChange={setCalories}
          onSubjectiveFeedbackFeelingsChange={setSubjectiveFeedbackFeelings}
          onPersonalGoalsChange={setPersonalGoals}
        />
      </Box>
    </Box>
  );
};

export default WorkoutPost;
