import { Box, Typography } from "@mui/material";
import { useStyles } from "../../pages/Feed/Feed.styles";

interface PostWorkoutDetailsProps {
    type?: string;
    duration?: number;
    calories?: number;
}

const PostWorkoutDetails = ({ type, duration, calories }: PostWorkoutDetailsProps) => {
    const classes = useStyles();

    if (!type) return null;

    return (
        <Box sx={classes.workoutDetails}>
            <Box sx={classes.workoutHeader}>
                <Typography variant="body2" sx={classes.workoutType}>
                    {type}
                </Typography>
                {duration && (
                    <Typography sx={classes.workoutStat}>
                        {duration} min
                    </Typography>
                )}
            </Box>
            {calories && (
                <Typography sx={classes.workoutStat}>
                    🔥 {calories} calories burned
                </Typography>
            )}
        </Box>
    );
};

export default PostWorkoutDetails;
