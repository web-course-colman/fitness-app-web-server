import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  message: {
    marginTop: theme.spacing(2),
  },
}));
