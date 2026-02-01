import { makeStyles } from "@/hooks/makeStyles";
import { Height } from "@mui/icons-material";

export const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 800,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        height: "-webkit-fill-available",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    minimizedSection: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2.5),
        padding: theme.spacing(4),
    },
    tagsGroup: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1),
    },
    miniSectionTitle: {
        fontSize: "0.8rem",
        textAlign: "center",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: theme.palette.text.secondary,
        opacity: 0.8,
    },
    tagsRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing(1),
        justifyContent: "center",
    },
    tipChip: {
        backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
        border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
        borderRadius: theme.spacing(1),
        fontWeight: 600,
        fontSize: "0.85rem",
        height: 32,
        transition: "all 0.2s ease",
        "& .MuiChip-icon": {
            color: "#6366f1",
            fontSize: "1rem",
        },
        "&:hover": {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.05)",
            borderColor: "rgba(99, 102, 241, 0.3)",
            transform: "translateY(-1px)",
        },
    },
    questionChip: {
        backgroundColor: "transparent",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.spacing(1),
        fontWeight: 500,
        fontSize: "0.85rem",
        height: 32,
        transition: "all 0.2s ease",
        "&:hover": {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
            borderColor: theme.palette.text.secondary,
            transform: "translateY(-1px)",
        },
    },
    aiCoachCard: {
        background: theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
        borderRadius: theme.spacing(3),
        padding: theme.spacing(4),
        boxShadow: theme.palette.mode === "dark"
            ? "0 10px 30px rgba(0, 0, 0, 0.4)"
            : "0 10px 30px rgba(0, 0, 0, 0.03)",
        border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
        position: "relative",
        overflow: "hidden",
        marginTop: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
        },
    },
    aiCoachHeader: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1.5),
        marginBottom: theme.spacing(0.5),
        flexShrink: 0,
    },
    aiCoachTitle: {
        fontWeight: 700,
        fontSize: "1rem",
        letterSpacing: "-0.01em",
        color: theme.palette.text.primary,
    },
    aiCoachSubtitle: {
        color: theme.palette.text.secondary,
        fontSize: "0.8rem",
        marginBottom: theme.spacing(1.5),
        opacity: 0.8,
        flexShrink: 0,
    },
    chatContainer: {
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2),
        "&::-webkit-scrollbar": {
            width: "6px",
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
            background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            borderRadius: "3px",
        },
    },
    messageBubble: {
        padding: theme.spacing(1.5, 2),
        borderRadius: theme.spacing(2),
        maxWidth: "85%",
        position: "relative",
        animation: "slideIn 0.3s ease",
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        borderBottomRightRadius: theme.spacing(0.5),
    },
    coachBubble: {
        alignSelf: "flex-start",
        backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(99, 102, 241, 0.05)",
        border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(99, 102, 241, 0.1)"}`,
        color: theme.palette.text.primary,
        borderBottomLeftRadius: theme.spacing(0.5),
    },
    inputContainer: {
        display: "flex",
        gap: theme.spacing(1.5),
        alignItems: "center",
        backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
        borderRadius: theme.spacing(2),
        padding: theme.spacing(1, 1.5),
        border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
        transition: "all 0.2s ease",
        flexShrink: 0,
        "&:focus-within": {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "#fff",
            boxShadow: theme.palette.mode === "dark"
                ? "0 4px 12px rgba(99, 102, 241, 0.2)"
                : "0 4px 12px rgba(99, 102, 241, 0.1)",
            borderColor: "rgba(99, 102, 241, 0.5)",
        },
    },
    inputField: {
        flex: 1,
        "& .MuiOutlinedInput-root": {
            fontSize: "1rem",
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
            "& fieldset": {
                border: "none",
            },
        },
        "& .MuiInputBase-input::placeholder": {
            color: theme.palette.text.secondary,
            opacity: 0.7,
        },
    },
    sendButton: {
        backgroundColor: theme.palette.mode === "dark" ? "#6366f1" : "#1e293b",
        color: "#fff",
        "&:hover": {
            backgroundColor: theme.palette.mode === "dark" ? "#4f46e5" : "#0f172a",
            transform: "scale(1.05)",
        },
        transition: "all 0.2s ease",
        borderRadius: theme.spacing(1.5),
        padding: theme.spacing(1.2),
    },
    resultsContainer: {
        marginTop: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
    answerText: {
        fontSize: "0.95rem",
        lineHeight: 1.6,
        color: "inherit",
    },
    sectionTitle: {
        fontSize: "0.75rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(1),
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
    },
    nextStepsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(0.75),
    },
    nextStepItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: theme.spacing(1),
        padding: theme.spacing(1),
        borderRadius: theme.spacing(1),
        backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.01)",
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.2s ease",
        cursor: "pointer",
        "& .MuiTypography-root": {
            fontSize: "0.85rem",
        },
        "&:hover": {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.05)" : "rgba(99, 102, 241, 0.02)",
        }
    },
    referenceCard: {
        padding: theme.spacing(1.5),
        borderRadius: theme.spacing(1.5),
        backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "#fff",
        border: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(0.5),
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: theme.shadows[4],
            borderColor: theme.palette.primary.main,
        }
    },
    referenceText: {
        fontSize: "0.85rem",
        color: theme.palette.text.secondary,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },
    referenceDate: {
        fontSize: "0.7rem",
        color: theme.palette.text.disabled,
        fontWeight: 600,
    }
}));
