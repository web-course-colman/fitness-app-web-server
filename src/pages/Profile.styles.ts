import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2),
        maxWidth: 800,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
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
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        gap: theme.spacing(3),
        alignItems: { xs: "center", md: "center" },
        textAlign: { xs: "center", md: "left" },
    },
    avatar: {
        width: { xs: 80, md: 100 },
        height: { xs: 80, md: 100 },
        fontSize: { xs: "2rem", md: "2.5rem" },
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
    minimizedStatsRow: {
        display: "flex",
        gap: { xs: theme.spacing(2), sm: theme.spacing(3) },
        marginTop: theme.spacing(2),
        padding: { xs: theme.spacing(2, 1), sm: theme.spacing(4) },
        width: { xs: "100%", md: "auto" },
        justifyContent: { xs: "center", md: "flex-start" },
    },
    minimizedStatItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    minimizedStatValue: {
        fontWeight: "bold",
        fontSize: "1.1rem",
    },
    minimizedStatLabel: {
        color: theme.palette.text.secondary,
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    minimizedAchievementsRow: {
        display: "flex",
        gap: theme.spacing(1),
        marginTop: theme.spacing(2),
        flexWrap: "wrap",
        justifyContent: { xs: "center", md: "flex-start" },
    },
    minimizedAchievementIcon: {
        width: 32,
        height: 32,
        bgcolor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
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
        gap: theme.spacing(1),
    },
    postsTitle: {
        fontSize: "1.25rem",
        fontWeight: "bold",
    },
    postsGrid: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
        padding: { xs: theme.spacing(1, 0), sm: theme.spacing(1, 2), md: theme.spacing(1, 5) },
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
    "@keyframes pulse": {
        "0%": {
            boxShadow: "0 0 0 0px rgba(255, 255, 255, 0.4)",
        },
        "70%": {
            boxShadow: "0 0 0 10px rgba(255, 255, 255, 0)",
        },
        "100%": {
            boxShadow: "0 0 0 0px rgba(255, 255, 255, 0)",
        },
    },
    "@keyframes shimmer": {
        "0%": {
            transform: "translateX(-150%) skewX(-20deg)",
        },
        "50%": {
            transform: "translateX(150%) skewX(-20deg)",
        },
        "100%": {
            transform: "translateX(150%) skewX(-20deg)",
        },
    },
    "@keyframes sparkle": {
        "0%, 100%": {
            filter: "brightness(1) contrast(1)",
        },
        "50%": {
            filter: "brightness(1.2) contrast(1.1)",
        },
    },
}));
