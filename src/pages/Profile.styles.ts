import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(4),
    },
    headerContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing(2),
    },
    profileCard: {
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
    userInfo: {
        display: "flex",
        gap: theme.spacing(3),
        alignItems: "center",
    },
    avatar: {
        width: 100,
        height: 100,
        fontSize: "2.5rem",
        bgcolor: "#34495e", // Dark color from the image
    },
    details: {
        display: "flex",
        flexDirection: "column",
    },
    userName: {
        fontWeight: "bold",
    },
    userHandle: {
        color: theme.palette.text.secondary,
    },
    bio: {
        marginTop: theme.spacing(1),
    },
    editButton: {
        marginTop: theme.spacing(1),
        textTransform: "none",
        border: "1px solid",
        borderColor: theme.palette.divider,
        color: theme.palette.text.primary,
        "&:hover": {
            bgcolor: theme.palette.action.hover,
        },
    },
    statsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            gridTemplateColumns: "1fr",
        },
    },
    statCard: {
        padding: theme.spacing(3),
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(1),
    },
    statValue: {
        fontWeight: "bold",
        fontSize: "1.5rem",
    },
    statLabel: {
        color: theme.palette.text.secondary,
        fontSize: "0.875rem",
    },
    statIcon: {
        fontSize: "2rem",
        color: theme.palette.text.secondary,
    },
    achievementsSection: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
    achievementItem: {
        padding: theme.spacing(2),
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.divider}`,
        "&:last-child": {
            borderBottom: "none",
        },
    },
    achievementIcon: {
        width: 48,
        height: 48,
        bgcolor: "#e5e7eb",
        color: "#9ca3af",
    },
    achievementInfo: {
        display: "flex",
        flexDirection: "column",
    },
    achievementName: {
        fontWeight: "medium",
    },
    achievementDescription: {
        color: theme.palette.text.secondary,
        fontSize: "0.875rem",
    },
    postsSection: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
    postsTitle: {
        fontSize: "1.25rem",
        fontWeight: "bold",
    },
    postsGrid: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
}));
