import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
        maxWidth: 800,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    sectionCard: {
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
    sectionHeader: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(1),
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        color: theme.palette.text.primary,
        fontWeight: 500,
    },
    select: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    logoutButton: {
        marginTop: theme.spacing(2),
        width: "100%",
        padding: theme.spacing(1.5),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.error.main,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing(1),
        cursor: "pointer",
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}));
