import { useState, useRef } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl
} from "@mui/material";
import {
    ArrowBack,
    Send,
    Image as ImageIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./WorkoutPost.styles";
import { useCreatePost } from "../hooks/usePosts";
import { useToast } from "../hooks/use-toast";

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
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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
            pictures: imagePreview ? [imagePreview] : [],
            workoutDetails: {
                type: workoutType || undefined,
                duration: duration ? parseInt(duration) : undefined,
                calories: calories ? parseInt(calories) : undefined,
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
                    description: error.response?.data?.message || "Failed to post workout",
                    variant: "destructive",
                });
            },
        });
    };

    const workoutTypes = [
        "Running",
        "Cycling",
        "Swimming",
        "Weightlifting",
        "Yoga",
        "Pilates",
        "HIIT",
        "Walking",
        "Other"
    ];

    return (
        <Box sx={styles.container}>
            {/* Hidden File Input */}
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

            {/* Title */}
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

            {/* Description */}
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

            {/* Add Photo / Preview Section */}
            <Box
                sx={{
                    ...styles.photoSection,
                    height: imagePreview ? "auto" : 100,
                    padding: imagePreview ? 1 : 0,
                    position: "relative"
                }}
                onClick={handlePhotoClick}
            >
                {imagePreview ? (
                    <>
                        <Box
                            component="img"
                            src={imagePreview}
                            alt="Workout preview"
                            sx={{
                                width: "100%",
                                maxHeight: 400,
                                objectFit: "contain",
                                borderRadius: "4px"
                            }}
                        />
                        <IconButton
                            sx={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                }
                            }}
                            size="small"
                            onClick={handleRemovePhoto}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <ImageIcon sx={{ color: "#64748b", fontSize: 32 }} />
                        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                            Add Photo
                        </Typography>
                    </>
                )}
            </Box>

            {/* Workout Details */}
            <Box sx={styles.workoutDetailsBox}>
                <Typography variant="h6" sx={styles.detailsTitle}>
                    Workout Details (Optional)
                </Typography>

                <Box sx={styles.rowItem}>
                    <Typography sx={styles.label}>Workout Type</Typography>
                    <FormControl fullWidth sx={styles.textField}>
                        <Select
                            value={workoutType}
                            onChange={(e) => setWorkoutType(e.target.value)}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <span style={{ color: "#94a3b8" }}>Select workout type</span>;
                                }
                                return selected as string;
                            }}
                        >
                            {workoutTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={styles.row}>
                    <Box sx={styles.rowItem}>
                        <Typography sx={styles.label}>Duration (min)</Typography>
                        <TextField
                            fullWidth
                            placeholder="45"
                            type="number"
                            variant="outlined"
                            sx={styles.textField}
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </Box>
                    <Box sx={styles.rowItem}>
                        <Typography sx={styles.label}>Calories Burned</Typography>
                        <TextField
                            fullWidth
                            placeholder="350"
                            type="number"
                            variant="outlined"
                            sx={styles.textField}
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default WorkoutPost;
