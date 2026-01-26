import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: 1000,
        margin: "0 auto",
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
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
        color: "#2c3e50",
    },
    textField: {
        "& .MuiOutlinedInput-root": {
            backgroundColor: "#f8fafc",
            "& fieldset": {
                borderColor: "#e2e8f0",
            },
            "&:hover fieldset": {
                borderColor: "#cbd5e1",
            },
            "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
            },
        },
    },
    photoSection: {
        width: "100%",
        minHeight: 100,
        border: "1px solid #e2e8f0",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: theme.spacing(1),
        cursor: "pointer",
        backgroundColor: "#f8fafc",
        padding: theme.spacing(2),
        "&:hover": {
            backgroundColor: "#f1f5f9",
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
    workoutDetailsBox: {
        padding: theme.spacing(3),
        border: "1px solid #e2e8f0",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
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
        gap: theme.spacing(1),
    },
}));
