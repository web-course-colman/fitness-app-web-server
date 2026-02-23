import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
    container: {
        mx: 'auto',
        maxHeight: { xs: 'none', md: 'calc(100vh - 100px)' },
        display: 'flex',
        flexDirection: 'column',
        width: { xs: '100%', md: '80%' },
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
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'center', md: 'flex-start' },
        gap: theme.spacing(3),
    },
    leftColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(2),
        padding: { xs: '1rem', md: '2.4rem' },
    },
    avatar: {
        width: { xs: 120, md: 200 },
        height: { xs: 120, md: 200 },
        border: '4px solid',
        borderColor: theme.palette.primary.main,
    },
    rightColumn: {
        width: '100%',
        paddingTop: { xs: 0, md: '2.4rem' },
    },
    actions: {
        display: 'flex',
        gap: theme.spacing(2),
        mt: 'auto',
        padding: { xs: theme.spacing(2), md: theme.spacing(4) },
        width: { xs: '100%', md: '80%' },
        mx: 'auto',
    },
}));
