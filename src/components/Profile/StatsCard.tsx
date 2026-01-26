import { Card, Typography, Box } from "@mui/material";
import { useStyles } from "../../pages/Profile.styles";

interface StatsCardProps {
    value: string | number;
    label: string;
    icon: React.ReactNode;
}

const StatsCard = ({ value, label, icon }: StatsCardProps) => {
    const classes = useStyles();

    return (
        <Card sx={classes.statCard}>
            <Box sx={classes.statIcon}>{icon}</Box>
            <Typography variant="h6" sx={classes.statValue}>
                {value}
            </Typography>
            <Typography variant="body2" sx={classes.statLabel}>
                {label}
            </Typography>
        </Card>
    );
};

export default StatsCard;
