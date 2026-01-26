import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";
import {
    ArrowBack,
    Send,
    Image as ImageIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./WorkoutPost.styles";

const WorkoutPost = () => {
    const styles = useStyles();
    const navigate = useNavigate();
    const [workoutType, setWorkoutType] = useState("");

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
                >
                    Share
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
                />
            </Box>

            {/* Add Photo */}
            <Box sx={styles.photoSection}>
                <ImageIcon sx={{ color: "#64748b", fontSize: 32 }} />
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                    Add Photo
                </Typography>
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
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default WorkoutPost;
