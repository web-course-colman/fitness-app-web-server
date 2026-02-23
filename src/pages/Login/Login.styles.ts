import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  content: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
  },
  logoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  logoCircle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    borderRadius: "50%",
  },
  logoIcon: {
    fontSize: 32,
    color: "primary.contrastText",
  },
  cardContent: {
    padding: theme.spacing(3),
  },
  formHeader: {
    marginBottom: theme.spacing(3),
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(1),
  },
  googleButton: {
    marginTop: theme.spacing(2),
  },
  footer: {
    marginTop: theme.spacing(3),
    textAlign: "center",
  },
}));
