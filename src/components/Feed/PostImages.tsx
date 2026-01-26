import { Box } from "@mui/material";
import { useStyles } from "../../pages/Feed.styles";

interface PostImagesProps {
    pictures: string[];
}

const PostImages = ({ pictures }: PostImagesProps) => {
    const classes = useStyles();

    if (!pictures || pictures.length === 0) return null;

    return (
        <Box sx={classes.imageContainer}>
            <Box
                sx={{
                    ...classes.imageGrid,
                    gridTemplateColumns: pictures.length === 1 ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))"
                }}
            >
                {pictures.map((pic, idx) => (
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
