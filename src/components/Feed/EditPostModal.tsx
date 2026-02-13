import { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useUpdatePost, Post } from "../../hooks/usePosts";
import { useToast } from "../../hooks/use-toast";
import PhotoUploadArea from "../Workouts/PhotoUploadArea";
import WorkoutDetailsSection from "../Workouts/WorkoutDetailsSection";

interface EditPostModalProps {
    open: boolean;
    onClose: () => void;
    post: Post;
}

const EditPostModal = ({ open, onClose, post }: EditPostModalProps) => {
    const { toast } = useToast();
    const updatePost = useUpdatePost();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description || "");
    const [workoutType, setWorkoutType] = useState(post.workoutDetails?.type || "");
    const [duration, setDuration] = useState(post.workoutDetails?.duration?.toString() || "");
    const [calories, setCalories] = useState(post.workoutDetails?.calories?.toString() || "");
    const [subjectiveFeedbackFeelings, setSubjectiveFeedbackFeelings] = useState(post.workoutDetails?.subjectiveFeedbackFeelings || "");
    const [personalGoals, setPersonalGoals] = useState(post.workoutDetails?.personalGoals || "");
    const [imagePreviews, setImagePreviews] = useState<string[]>(post.src ? [post.src] : []);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (open) {
            setTitle(post.title);
            setDescription(post.description || "");
            setWorkoutType(post.workoutDetails?.type || "");
            setDuration(post.workoutDetails?.duration?.toString() || "");
            setCalories(post.workoutDetails?.calories?.toString() || "");
            setSubjectiveFeedbackFeelings(post.workoutDetails?.subjectiveFeedbackFeelings || "");
            setPersonalGoals(post.workoutDetails?.personalGoals || "");
            setImagePreviews(post.src ? [post.src] : []);
            setSelectedFile(null);
        }
    }, [open, post]);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const validFiles = files.filter((file) => file.type.startsWith("image/"));

        if (validFiles.length > 0) {
            const file = validFiles[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews([reader.result as string]);
            };
            reader.readAsDataURL(file);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemovePhoto = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreviews([]);
        setSelectedFile(null);
    };

    const handleSave = async () => {
        if (!title.trim()) {
            toast({
                title: "Error",
                description: "Title is required",
                variant: "destructive",
            });
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);

        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        const workoutDetails = {
            type: workoutType || undefined,
            duration: duration ? parseInt(duration) : undefined,
            calories: calories ? parseInt(calories) : undefined,
            subjectiveFeedbackFeelings: subjectiveFeedbackFeelings.trim() || undefined,
            personalGoals: personalGoals.trim() || undefined,
        };

        formData.append("workoutDetails", JSON.stringify(workoutDetails));

        updatePost.mutate({ postId: post._id, formData }, {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Post updated successfully!",
                });
                onClose();
            },
            onError: (error: any) => {
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to update post",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Edit Post
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Title</Typography>
                        <TextField
                            fullWidth
                            placeholder="What's your workout about?"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            size="small"
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Description</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Share your workout experience..."
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            size="small"
                        />
                    </Box>

                    <PhotoUploadArea
                        imagePreviews={imagePreviews}
                        onPhotoClick={handlePhotoClick}
                        onRemovePhoto={handleRemovePhoto}
                    />

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
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={updatePost.isPending}>
                    {updatePost.isPending ? "Saving..." : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPostModal;
