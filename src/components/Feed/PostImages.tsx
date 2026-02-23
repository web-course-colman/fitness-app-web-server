import { Box } from "@mui/material";
import { useStyles } from "../../pages/Feed/Feed.styles";

interface PostImagesProps {
    src?: string;
    pictures: string[];
}

const PostImages = ({ src, pictures }: PostImagesProps) => {
    const classes = useStyles();

    // Prioritize pictures array if it has valid images. 
    // If pictures is empty/undefined, fall back to src.
    // Note: In our new backend logic, pictures contains all URLs including the one in src.
    const imagesToDisplay = (pictures && pictures.length > 0) ? pictures : (src ? [src] : []);

    if (!imagesToDisplay || imagesToDisplay.length === 0) return null;

    return (
        <Box sx={classes.imageContainer}>
            <Box
                sx={{
                    ...classes.imageGrid,
                    gridTemplateColumns: imagesToDisplay.length === 1 ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))"
                }}
            >
                {imagesToDisplay.map((pic, idx) => (
                    <Box
                        key={idx}
                        component="img"
                        src={pic}
                        alt={`Workout content ${idx + 1}`}
                        sx={classes.postImage}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default PostImages;
