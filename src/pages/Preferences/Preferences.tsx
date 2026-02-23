import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Switch,
  Select,
  MenuItem,
  FormControl,
  Alert,
  Fade,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  ArrowBack,
  Brightness4Outlined as DarkModeIcon,
  LockOutlined as GoalIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { usePreferences } from "@/hooks/usePreferences";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useStyles } from "./Preferences.styles";

const DEFAULT_PREFERENCES = {
  pushNotifications: true,
  darkMode: false,
  units: "metric",
  weeklyGoal: 3,
};

const Preferences = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    preferences: initialPreferences,
    updatePreferences,
    isUpdating,
  } = usePreferences();

  const [localPrefs, setLocalPrefs] = useState(
    initialPreferences || DEFAULT_PREFERENCES,
  );
  const [showSaved, setShowSaved] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialPreferences) {
      setLocalPrefs(initialPreferences);
    }
  }, [initialPreferences]);

  const handlePreferenceChange = (update: any) => {
    const newPrefs = { ...localPrefs, ...update };
    setLocalPrefs(newPrefs);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      updatePreferences(update, {
        onSuccess: () => {
          setShowSaved(true);
          setTimeout(() => setShowSaved(false), 2000);
        },
      });
    }, 500);
  };

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
        <Fade in={showSaved || isUpdating}>
          <Box sx={{ ml: "auto" }}>
            <Alert
              severity="success"
              icon={false}
              sx={{ py: 0, px: 1, fontSize: "0.75rem", minWidth: 60 }}
            >
              {isUpdating ? "Saving..." : "Saved"}
            </Alert>
          </Box>
        </Fade>
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
          <Switch
            checked={localPrefs.darkMode}
            onChange={(e) =>
              handlePreferenceChange({ darkMode: e.target.checked })
            }
          />
        </Box>
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
          <Select
            value={localPrefs.weeklyGoal}
            onChange={(e) =>
              handlePreferenceChange({ weeklyGoal: Number(e.target.value) })
            }
          >
            <MenuItem value={1}>1 workout per week</MenuItem>
            <MenuItem value={2}>2 workouts per week</MenuItem>
            <MenuItem value={3}>3 workouts per week</MenuItem>
            <MenuItem value={4}>4 workouts per week</MenuItem>
            <MenuItem value={5}>5 workouts per week</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Log Out */}
      <Box component="button" sx={classes.logoutButton} onClick={logout}>
        <LogoutIcon fontSize="small" />
        <Typography fontWeight="bold">Log Out</Typography>
      </Box>
    </Box>
  );
};

export default Preferences;
