import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 800,
    margin: "0 auto",
  },
  postsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
  },
  errorContainer: {
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
  errorBackButton: {
    marginTop: theme.spacing(2),
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(3),
  },
  backIconButton: {
    marginRight: theme.spacing(1),
  },
}));
