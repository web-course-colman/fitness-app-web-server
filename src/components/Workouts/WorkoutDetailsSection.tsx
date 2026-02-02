import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { useStyles } from "../../pages/WorkoutPost.styles";

const personalGoalOptions = [
  // 🎯 Performance goals
  { group: "🎯 Performance goals", label: "Increase bench press weight by 2.5kg" },
  { group: "🎯 Performance goals", label: "Complete all sets without reducing reps" },
  { group: "🎯 Performance goals", label: "Improve running pace compared to last week" },
  { group: "🎯 Performance goals", label: "Hold plank for 60 seconds without breaking form" },
  { group: "🎯 Performance goals", label: "Finish the workout within the planned time" },

  // 🧠 Technique & quality goals
  { group: "🧠 Technique & quality goals", label: "Maintain proper squat depth on every rep" },
  { group: "🧠 Technique & quality goals", label: "Focus on controlled tempo instead of rushing" },
  { group: "🧠 Technique & quality goals", label: "Improve breathing during cardio intervals" },
  { group: "🧠 Technique & quality goals", label: "Keep correct posture throughout the workout" },
  { group: "🧠 Technique & quality goals", label: "Reduce rest time between sets to 60 seconds" },

  // 🔥 Endurance & conditioning goals
  { group: "🔥 Endurance & conditioning goals", label: "Complete the full workout without stopping" },
  { group: "🔥 Endurance & conditioning goals", label: "Sustain heart rate in fat-burn zone for 20 minutes" },
  { group: "🔥 Endurance & conditioning goals", label: "Push through the final round without skipping" },
  { group: "🔥 Endurance & conditioning goals", label: "Improve stamina compared to last session" },
  { group: "🔥 Endurance & conditioning goals", label: "Finish strong without energy crashes" },

  // 💪 Strength & muscle goals
  { group: "💪 Strength & muscle goals", label: "Activate chest and shoulders more effectively" },
  { group: "💪 Strength & muscle goals", label: "Improve mind-muscle connection" },
  { group: "💪 Strength & muscle goals", label: "Reach muscle failure only on the last set" },
  { group: "💪 Strength & muscle goals", label: "Feel balanced activation on both sides" },
  { group: "💪 Strength & muscle goals", label: "Avoid compensating with weaker muscles" },

  // 🧘 Recovery & health goals
  { group: "🧘 Recovery & health goals", label: "Train without aggravating knee/shoulder pain" },
  { group: "🧘 Recovery & health goals", label: "Stop the workout feeling energized, not exhausted" },
  { group: "🧘 Recovery & health goals", label: "Stretch properly after finishing" },
  { group: "🧘 Recovery & health goals", label: "Keep soreness minimal for tomorrow’s workout" },
  { group: "🧘 Recovery & health goals", label: "Maintain good hydration throughout" },

  // 🧠 Mental & habit goals
  { group: "🧠 Mental & habit goals", label: "Show up and complete the workout (no excuses)" },
  { group: "🧠 Mental & habit goals", label: "Stay focused and present during training" },
  { group: "🧠 Mental & habit goals", label: "Enjoy the workout instead of rushing it" },
  { group: "🧠 Mental & habit goals", label: "Build consistency (3rd workout this week)" },
  { group: "🧠 Mental & habit goals", label: "End the session in a better mood than I started" },
];

interface WorkoutDetailsSectionProps {
  workoutType: string;
  duration: string;
  calories: string;
  subjectiveFeedbackFeelings: string;
  personalGoals: string;
  onWorkoutTypeChange: (type: string) => void;
  onDurationChange: (duration: string) => void;
  onCaloriesChange: (calories: string) => void;
  onSubjectiveFeedbackFeelingsChange: (value: string) => void;
  onPersonalGoalsChange: (value: string) => void;
}

const WorkoutDetailsSection = ({
  workoutType,
  duration,
  calories,
  subjectiveFeedbackFeelings,
  personalGoals,
  onWorkoutTypeChange,
  onDurationChange,
  onCaloriesChange,
  onSubjectiveFeedbackFeelingsChange,
  onPersonalGoalsChange,
}: WorkoutDetailsSectionProps) => {
  const styles = useStyles();

  const workoutTypes = [
    "Running",
    "Cycling",
    "Swimming",
    "Weightlifting",
    "Yoga",
    "Pilates",
    "HIIT",
    "Walking",
    "Other",
  ];

  return (
    <Box sx={styles.workoutDetailsBox} >
      <Typography variant="h6" sx={styles.detailsTitle}>
        Workout Details (Will help AI Tips)
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
                return (
                  <span style={{ color: "#94a3b8" }}>Select workout type</span>
                );
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

      <Box sx={styles.rowItem}>
        <Typography sx={styles.label}>
          Subjective feedback & feelings (won't appear in feed)
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="How did you feel? Energy, mood, soreness, progress..."
          variant="outlined"
          sx={styles.textField}
          value={subjectiveFeedbackFeelings}
          onChange={(e) => onSubjectiveFeedbackFeelingsChange(e.target.value)}
        />
      </Box>

      <Box sx={styles.rowItem}>
        <Typography sx={styles.label}>Personal goals (won't appear in feed)</Typography>
        <Autocomplete
          freeSolo
          options={personalGoalOptions.sort((a, b) =>
            -b.group.localeCompare(a.group)
          )}
          groupBy={(option) => option.group}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            // Regular option
            return option.label;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              placeholder="Select or type a goal..."
              sx={styles.textField}
            />
          )}
          value={personalGoals}
          onChange={(e, newValue) => {
            if (typeof newValue === 'string') {
              onPersonalGoalsChange(newValue);
            } else if (newValue && newValue.label) {
              onPersonalGoalsChange(newValue.label);
            } else {
              onPersonalGoalsChange("");
            }
          }}
          onInputChange={(event, newInputValue) => {
            onPersonalGoalsChange(newInputValue);
          }}
        />
      </Box>
    </Box>
  );
};

export default WorkoutDetailsSection;
