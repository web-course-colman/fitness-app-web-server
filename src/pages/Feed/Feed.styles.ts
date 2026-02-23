import { makeStyles } from "@/hooks/makeStyles";
import { Padding } from "@mui/icons-material";

export const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 800,
        margin: "0 auto",
    },
    postsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
        marginTop: theme.spacing(3),
    },
    infiniteSentinel: {
        height: 1,
    },
    infiniteLoaderContainer: {
        display: "flex",
        justifyContent: "center",
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    },
    card: {
        borderRadius: theme.spacing(2),
    },
    cardHeader: {
        paddingBottom: theme.spacing(1),
    },
    authorName: {
        fontWeight: 600,
    },
    timestamp: {
        color: theme.palette.text.secondary,
    },
    cardContent: {
        paddingTop: 0,
        "&:last-child": {
            paddingBottom: theme.spacing(2),
        },
    },
    contentWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
    postTitle: {
        fontWeight: 600,
    },
    description: {
        color: theme.palette.text.primary,
    },
    imageContainer: {
        width: "100%",
        borderRadius: theme.spacing(1),
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
    },
    imageGrid: {
        display: "grid",
        gap: theme.spacing(1),
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    },
    postImage: {
        width: "100%",
        height: "100%",
        minHeight: 200,
        maxHeight: 400,
        objectFit: "cover",
    },
    workoutDetails: {
        backgroundColor: theme.palette.action.hover,
        padding: theme.spacing(1.5),
        borderRadius: theme.spacing(1),
    },
    workoutHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    workoutType: {
        fontWeight: 500,
    },
    workoutStat: {
        color: theme.palette.text.secondary,
        fontSize: "0.75rem",
    },
    actionsContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: theme.spacing(1),
        borderTop: `1px solid ${theme.palette.divider}`,
    },
    actionButtons: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
    },
    actionButton: {
        textTransform: "none",
    },
    commentsSection: {
        marginTop: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(0.5),
        padding: theme.spacing(0.5, 5),
    },
    commentItem: {
        display: "flex",
        gap: theme.spacing(1),
        padding: theme.spacing(0.5, 0),
    },
    commentContent: {
        backgroundColor: theme.palette.action.hover,
        padding: theme.spacing(0.5, 1),
        borderRadius: theme.spacing(1.5),
        flex: 1,
    },
    commentInputContainer: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
        marginTop: theme.spacing(0.5),
    },
    commentInput: {
        "& .MuiOutlinedInput-root": {
            borderRadius: theme.spacing(2),
            backgroundColor: theme.palette.action.hover,
            fontSize: "0.875rem",
        },
        "& .MuiInputBase-input": {
            padding: theme.spacing(0.8, 1.5),
        },
    },
    loadMoreButton: {
        padding: 0,
        minWidth: "auto",
        textTransform: "none",
        fontSize: "0.7rem",
        fontWeight: 600,
        color: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
        },
    },
    commentsPagination: {
        display: "flex",
        gap: theme.spacing(1.5),
        marginTop: theme.spacing(0.2),
        paddingLeft: theme.spacing(0.5),
    },
}));
