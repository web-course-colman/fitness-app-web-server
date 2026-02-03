import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 1000,
        margin: "0 auto",
        padding: { xs: theme.spacing(2), sm: theme.spacing(3) },
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
    },
    stepperContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(3),
        marginBottom: theme.spacing(4),
    },
    muiStepper: {
        width: "100%",
        maxWidth: 500,
        "& .MuiStepIcon-root": {
            color: theme.palette.divider,
            "&.Mui-active": {
                color: theme.palette.primary.main,
            },
            "&.Mui-completed": {
                color: theme.palette.primary.main,
            },
        },
        "& .MuiStepLabel-label": {
            fontSize: "0.85rem",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            "&.Mui-active": {
                color: theme.palette.primary.main,
                fontWeight: 600,
            },
            "&.Mui-completed": {
                color: theme.palette.primary.main,
            },
        },
    },
    stepContent: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
        animation: "fadeIn 0.3s ease-in-out",
        "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(10px)" },
            to: { opacity: 1, transform: "translateY(0)" },
        },
    },
    navigationButtons: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: theme.spacing(4),
        paddingTop: theme.spacing(3),
        borderTop: `1px solid ${theme.palette.divider}`,
        gap: theme.spacing(2),
    },
    backButton: {
        textTransform: "none",
        fontWeight: 600,
    },
    nextButton: {
        textTransform: "none",
        fontWeight: 600,
        padding: "8px 24px",
        borderRadius: "8px",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing(2),
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
    },
    title: {
        fontWeight: 600,
    },
    shareButton: {
        textTransform: "none",
        fontWeight: 600,
        padding: "6px 20px",
        borderRadius: "4px",
        backgroundColor: "#2c3e50",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#34495e",
        },
    },
    inputSection: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1),
    },
    label: {
        fontWeight: 600,
        fontSize: "0.9rem",
        color: theme.palette.text.primary,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(0.5),
    },
    textField: {
        "& .MuiOutlinedInput-root": {
            backgroundColor: theme.palette.mode === "dark" ? "#2c2c2c" : "#f8fafc",
            "& fieldset": {
                borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "#e2e8f0",
            },
            "&:hover fieldset": {
                borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.87)" : "#cbd5e1",
            },
            "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
            },
        },
    },
    photoSection: {
        width: "100%",
        minHeight: 100,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: theme.spacing(1),
        cursor: "pointer",
        backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f8fafc",
        padding: theme.spacing(2),
        "&:hover": {
            backgroundColor: theme.palette.mode === "dark" ? "#2c2c2c" : "#f1f5f9",
        },
    },
    previewGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: theme.spacing(2),
        width: "100%",
    },
    previewItem: {
        position: "relative",
        aspectRatio: "1/1",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
    },
    previewImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    removeBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "#fff",
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.8)",
        },
    },
    formBox: {
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        padding: { xs: theme.spacing(2), sm: theme.spacing(3) },
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
        backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
        boxShadow: theme.palette.mode === "dark" ? "none" : "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    detailsTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(1),
    },
    row: {
        display: "flex",
        gap: theme.spacing(3),
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
        },
    },
    rowItem: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
}));
