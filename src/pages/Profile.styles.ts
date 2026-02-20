import { makeStyles } from "@/hooks/makeStyles";

export const getTierColor = (tier: string) =>
    tier === "diamond"
        ? "#b9f2ff"
        : tier === "gold"
            ? "#ffd700"
            : tier === "silver"
                ? "#c0c0c0"
                : tier === "bronze"
                    ? "#cd7f32"
                    : "#9ca3af";

export const getAchievementAvatarSx = (baseStyle: any, tierColor: string, isLocked: boolean) => ({
    ...baseStyle,
    bgcolor: isLocked ? "#f3f4f6" : tierColor,
    border: "none",
    filter: isLocked ? "grayscale(100%)" : "none",
    opacity: isLocked ? 0.5 : 1,
    position: "relative",
    overflow: "hidden",
    animation: isLocked ? "none" : "sparkle 4s infinite ease-in-out",
    boxShadow: isLocked ? "none" : `0 0 20px ${tierColor}44`,
    "&::after": isLocked
        ? {}
        : {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            animation: "shimmer 3s infinite linear",
        },
    "& img": {
        filter: isLocked
            ? "grayscale(100%)"
            : "drop-shadow(0 4px 6px rgba(0,0,0,0.4)) contrast(1.2)",
        transform: "scale(0.97)",
    },
});

export const getAchievementTrophyIconSx = (tier: string, isLocked: boolean) => ({
    color: isLocked || tier === "bronze" ? "white" : "rgba(0,0,0,0.8)",
    stroke: isLocked || tier === "bronze" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)",
    strokeWidth: 0.8,
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
});

export const getMinimizedAchievementAvatarSx = (baseStyle: any, tierColor: string, isLocked: boolean) => ({
    ...baseStyle,
    bgcolor: isLocked ? "#f3f4f6" : tierColor,
    border: "none",
    filter: isLocked ? "grayscale(100%)" : "none",
    opacity: isLocked ? 0.4 : 1,
    position: "relative",
    overflow: "hidden",
    animation: isLocked ? "none" : "sparkle 3s infinite ease-in-out",
    boxShadow: isLocked ? "none" : `0 0 15px ${tierColor}66`,
    "&::after": isLocked
        ? {}
        : {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            animation: "shimmer 4s infinite linear",
        },
    "& img": {
        filter: isLocked
            ? "grayscale(100%)"
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.3)) contrast(1.1)",
        objectFit: "contain",
        padding: "0.1px",
    },
    "&:hover": {
        transform: isLocked ? "none" : "scale(1.15)",
        transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        boxShadow: isLocked ? "none" : `0 0 25px ${tierColor}`,
    },
});

export const getMinimizedAchievementTrophyIconSx = (tier: string, isLocked: boolean) => ({
    fontSize: "1.2rem",
    color: isLocked || tier === "bronze" ? "white" : "rgba(0,0,0,0.8)",
    stroke: isLocked || tier === "bronze" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
    strokeWidth: 0.5,
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
});

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
    userInfoMain: {
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        gap: 3,
        width: { xs: "100%", md: "auto" },
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
        width: 40,
        height: 40,
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
    achievementsTitle: {
        fontWeight: "bold",
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
        width: 60,
        height: 60,
        bgcolor: "#e5e7eb",
        color: "#9ca3af",
    },
    achievementInfo: {
        display: "flex",
        flexDirection: "column",
    },
    achievementInfoLocked: {
        opacity: 0.6,
    },
    achievementName: {
        fontWeight: "medium",
    },
    achievementTier: {
        fontSize: "0.75rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        marginLeft: theme.spacing(1),
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
