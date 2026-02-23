import { makeStyles } from "@/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(1),
    fontSize: "2.125rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.75rem",
    },
  },
  subtitle: {
    marginBottom: theme.spacing(3),
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(2),
  },
  cardItem: {
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "calc((100% - 32px) / 3)",
    },
  },
  cardWrapper: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  card: {
    width: "100%",
    borderRadius: theme.spacing(3 / 2),
    border: "1px solid",
    borderColor: theme.palette.divider,
    display: "flex",
    flexDirection: "column",
  },
  cardContent: {
    padding: theme.spacing(2.5),
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  icon: {
    width: "6vw",
    objectFit: "contain",
  },
  achievementHeaderText: {
    minWidth: 0,
  },
  achievementName: {
    fontWeight: 700,
    lineHeight: 1.2,
    fontSize: "1.25rem",
    overflowWrap: "anywhere",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
    marginBottom: theme.spacing(1.5),
  },
  tierChip: {
    textTransform: "capitalize",
    fontWeight: 700,
    maxWidth: "100%",
  },
  description: {
    marginBottom: theme.spacing(1.5),
    overflowWrap: "anywhere",
  },
  ruleText: {
    display: "block",
    marginBottom: theme.spacing(1.5),
    overflowWrap: "anywhere",
  },
  progressText: {
    fontWeight: 700,
    display: "block",
    marginBottom: theme.spacing(1.5),
    overflowWrap: "anywhere",
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
  },
  tiersStack: {
    marginTop: theme.spacing(2.5),
  },
  tierText: {
    fontWeight: 700,
    textTransform: "capitalize",
  },
}));
