import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
    container: {
        mx: 'auto',
        maxHeight: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
        flex: 1,
        minHeight: 0,
    },
    contentRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    leftColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(2),
        padding: '2.4rem',
    },
    avatar: {
        width: 200,
        height: 200,
        border: '4px solid',
        borderColor: theme.palette.primary.main,
    },
    rightColumn: {
        width: '100%',
        padding: '2.4rem',
    },
    actions: {
        display: 'flex',
        gap: theme.spacing(2),
        mt: 'auto',
        pt: theme.spacing(2),
        width: '80%',
        mx: 'auto',
    },
}));
