import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.action.hover,
  },
  content: {
    textAlign: "center",
  },
  code: {
    marginBottom: theme.spacing(2),
    fontSize: "2.25rem",
    fontWeight: 700,
  },
  message: {
    marginBottom: theme.spacing(2),
    fontSize: "1.25rem",
    color: theme.palette.text.secondary,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "underline",
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },
}));
