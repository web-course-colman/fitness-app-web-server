import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    IconButton,
    Switch,
    Select,
    MenuItem,
    FormControl,
} from "@mui/material";
import {
    ArrowBack,
    NotificationsNone as NotificationsIcon,
    Brightness4Outlined as DarkModeIcon,
    LanguageOutlined as UnitsIcon,
    LockOutlined as GoalIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";
import { useStyles } from "./Preferences.styles";

const Preferences = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Box sx={classes.container}>
            <Box sx={classes.header}>
                <IconButton onClick={handleBack} edge="start" size="small">
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" fontWeight="bold">
                    Preferences
                </Typography>
            </Box>

            {/* Notifications */}
            <Box sx={classes.sectionCard}>
                <Box sx={classes.sectionHeader}>
                    <NotificationsIcon fontSize="small" />
                    <Typography variant="subtitle1" fontWeight="600">
                        Notifications
                    </Typography>
                </Box>
                <Box sx={classes.row}>
                    <Typography sx={classes.label}>Push Notifications</Typography>
                    <Switch defaultChecked />
                </Box>
            </Box>

            {/* Appearance */}
            <Box sx={classes.sectionCard}>
                <Box sx={classes.sectionHeader}>
                    <DarkModeIcon fontSize="small" />
                    <Typography variant="subtitle1" fontWeight="600">
                        Appearance
                    </Typography>
                </Box>
                <Box sx={classes.row}>
                    <Typography sx={classes.label}>Dark Mode</Typography>
                    <Switch />
                </Box>
            </Box>

            {/* Units */}
            <Box sx={classes.sectionCard}>
                <Box sx={classes.sectionHeader}>
                    <UnitsIcon fontSize="small" />
                    <Typography variant="subtitle1" fontWeight="600">
                        Units
                    </Typography>
                </Box>
                <FormControl variant="outlined" size="small" sx={classes.select}>
                    <Select defaultValue="metric">
                        <MenuItem value="metric">Metric (kg, km)</MenuItem>
                        <MenuItem value="imperial">Imperial (lb, mi)</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Weekly Goal */}
            <Box sx={classes.sectionCard}>
                <Box sx={classes.sectionHeader}>
                    <GoalIcon fontSize="small" />
                    <Typography variant="subtitle1" fontWeight="600">
                        Weekly Goal
                    </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    How many workouts per week?
                </Typography>
                <FormControl variant="outlined" size="small" sx={classes.select}>
                    <Select defaultValue={3}>
                        <MenuItem value={1}>1 workout per week</MenuItem>
                        <MenuItem value={2}>2 workouts per week</MenuItem>
                        <MenuItem value={3}>3 workouts per week</MenuItem>
                        <MenuItem value={4}>4 workouts per week</MenuItem>
                        <MenuItem value={5}>5 workouts per week</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Log Out */}
            <Box
                component="button"
                sx={classes.logoutButton}
                onClick={() => console.log("Logout")}
            >
                <LogoutIcon fontSize="small" />
                <Typography fontWeight="bold">Log Out</Typography>
            </Box>
        </Box>
    );
};

export default Preferences;
