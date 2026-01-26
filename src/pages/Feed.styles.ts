import { makeStyles } from "@/hooks/makeStyles";

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
}));
