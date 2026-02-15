import { useState, useRef } from "react";
import { Box, Typography, TextField, Button, IconButton, Stepper, Step, StepLabel } from "@mui/material";
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

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [subjectiveFeedbackFeelings, setSubjectiveFeedbackFeelings] =
    useState("");
  const [personalGoals, setPersonalGoals] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);

      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim()) {
        toast({
          title: "Error",
          description: "Title is required",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const handleShare = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (selectedFiles && selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        formData.append("files", file);
      });
    }

    const workoutDetails = {
      type: workoutType || undefined,
      duration: duration ? parseInt(duration) : undefined,
      calories: calories ? parseInt(calories) : undefined,
      subjectiveFeedbackFeelings: subjectiveFeedbackFeelings.trim() || undefined,
      personalGoals: personalGoals.trim() || undefined,
    };

    formData.append("workoutDetails", JSON.stringify(workoutDetails));

    createPost.mutate(formData as any, {
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
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Header */}
      <Box sx={styles.header}>
        <Box sx={styles.headerLeft}>
          <IconButton onClick={handleBack} size="small">
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={styles.title}>
            {step === 1 ? "New Post" : "Workout Details"}
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={styles.stepperContainer}>
        <Stepper activeStep={step - 1} sx={styles.muiStepper}>
          {["Basics", "Details"].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Content Inputs */}
      <Box sx={styles.stepContent}>
        {step === 1 ? (
          <Box sx={styles.formBox}>
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
              <Typography sx={styles.label}>
                Description (Will help AI Tips)
              </Typography>
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
        ) : (
          <Box sx={styles.formBox}>
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
        )}
      </Box>

      {/* Navigation Footer */}
      <Box sx={styles.navigationButtons}>
        <Button
          onClick={handleBack}
          sx={styles.backButton}
          disabled={createPost.isPending}
        >
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        <Button
          variant="contained"
          sx={styles.nextButton}
          onClick={step === 1 ? handleNext : handleShare}
          disabled={createPost.isPending}
          endIcon={step === 2 ? <Send /> : null}
        >
          {createPost.isPending
            ? "Sharing..."
            : step === 1
              ? "Next Step"
              : "Share Post"}
        </Button>
      </Box>
    </Box>
  );
};

export default WorkoutPost;
