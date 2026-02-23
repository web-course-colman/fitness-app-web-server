import { Box, Typography, IconButton } from "@mui/material";
import { Image as ImageIcon, Close as CloseIcon } from "@mui/icons-material";
import { useStyles } from "../../pages/WorkoutPost/WorkoutPost.styles";

interface PhotoUploadAreaProps {
    imagePreviews: string[];
    onPhotoClick: () => void;
    onRemovePhoto: (index: number, e: React.MouseEvent) => void;
}

const PhotoUploadArea = ({ imagePreviews, onPhotoClick, onRemovePhoto }: PhotoUploadAreaProps) => {
    const styles = useStyles();

    return (
        <Box
            sx={styles.photoSection}
            onClick={onPhotoClick}
        >
            {imagePreviews.length > 0 ? (
                <Box sx={styles.previewGrid}>
                    {imagePreviews.map((preview, index) => (
                        <Box key={index} sx={styles.previewItem}>
                            <Box
                                component="img"
                                src={preview}
                                sx={styles.previewImage}
                            />
                            <IconButton
                                sx={styles.removeBadge}
                                size="small"
                                onClick={(e) => onRemovePhoto(index, e)}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                    <Box
                        sx={{
                            ...styles.previewItem,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,0.05)",
                            borderStyle: "dashed",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.1)",
                            }
                        }}
                    >
                        <ImageIcon sx={{ color: "#64748b", fontSize: 24 }} />
                    </Box>
                </Box>
            ) : (
                <>
                    <ImageIcon sx={{ color: "#64748b", fontSize: 32 }} />
                    <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                        Add Photo
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default PhotoUploadArea;
