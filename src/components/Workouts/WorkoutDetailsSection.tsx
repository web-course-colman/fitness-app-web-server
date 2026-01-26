import { Box, Typography, TextField, FormControl, Select, MenuItem } from "@mui/material";
import { useStyles } from "../../pages/WorkoutPost.styles";

interface WorkoutDetailsSectionProps {
    workoutType: string;
    duration: string;
    calories: string;
    onWorkoutTypeChange: (type: string) => void;
    onDurationChange: (duration: string) => void;
    onCaloriesChange: (calories: string) => void;
}

const WorkoutDetailsSection = ({
    workoutType,
    duration,
    calories,
    onWorkoutTypeChange,
    onDurationChange,
    onCaloriesChange
}: WorkoutDetailsSectionProps) => {
    const styles = useStyles();

    const workoutTypes = [
        "Running", "Cycling", "Swimming", "Weightlifting",
        "Yoga", "Pilates", "HIIT", "Walking", "Other"
    ];

    return (
        <Box sx={styles.workoutDetailsBox}>
            <Typography variant="h6" sx={styles.detailsTitle}>
                Workout Details (Optional)
            </Typography>

            <Box sx={styles.rowItem}>
                <Typography sx={styles.label}>Workout Type</Typography>
                <FormControl fullWidth sx={styles.textField}>
                    <Select
                        value={workoutType}
                        onChange={(e) => onWorkoutTypeChange(e.target.value)}
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
                        onChange={(e) => onDurationChange(e.target.value)}
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
                        onChange={(e) => onCaloriesChange(e.target.value)}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default WorkoutDetailsSection;
