import { useState, useEffect, useCallback } from "react";
import {
  Avatar,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  Typography,
  Fab,
  Zoom,
  alpha,
  Paper,
  Autocomplete,
  TextField,
  InputAdornment,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import NavigationSidebar, {
  DRAWER_WIDTH,
  COLLAPSED_WIDTH,
} from "./NavigationSidebar";
import { useAuth } from "./Auth/AuthProvider";
import api from "../services/axios";
import { debounce } from "lodash";

interface SearchUser {
  _id: string;
  name: string;
  lastName: string;
  username: string;
  picture?: string;
}

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [options, setOptions] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hideFab = ["/workouts", "/ai-tips"].includes(location.pathname);
  const isAiTipsPage = location.pathname === "/ai-tips";

  const currentDrawerWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const fetchUsers = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/api/auth/search?q=${query}`);
        setOptions(response.data);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchUsers(inputValue);
  }, [inputValue, fetchUsers]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed((prev: boolean) => {
      const newState = !prev;
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
      return newState;
    });
  };

  const getInitials = (name: string, lastName: string) => {
    return `${name?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getPageTitle = (pathname: string) => {
    const titles: Record<string, string> = {
      "/feed": "Feed",
      "/workouts": "New Workout",
      "/ai-tips": "AI Coacher",
      "/profile": "Profile",
      "/edit-profile": "Edit Profile",
      "/preferences": "Settings",
    };
    return titles[pathname] || "FitTrack";
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#0f172a" : "#f1f5f9",
        overflow: "hidden",
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          bgcolor: "transparent",
          color: "text.primary",
          borderBottom: "none",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          zIndex: (theme) => ({ md: theme.zIndex.drawer + 1 }),
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 700, display: { xs: "none", sm: "block" }, minWidth: '100px' }}
            >
              {getPageTitle(location.pathname)}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
            <Autocomplete
              open={searchOpen}
              onOpen={() => setSearchOpen(true)}
              onClose={() => setSearchOpen(false)}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              getOptionLabel={(option) => `${option.name} ${option.lastName}`}
              options={options}
              loading={loading}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
              }}
              onChange={(_, value) => {
                if (value) {
                  navigate(`/feed?authorId=${value._id}&authorName=${encodeURIComponent(`${value.name} ${value.lastName}`)}`);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search users..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                    sx: {
                      borderRadius: "12px",
                      bgcolor: (theme) =>
                        alpha(
                          theme.palette.mode === "dark"
                            ? "#ffffff"
                            : "#000000",
                          0.05
                        ),
                      "& fieldset": { border: "none" },
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(
                            theme.palette.mode === "dark"
                              ? "#ffffff"
                              : "#000000",
                            0.08
                          ),
                      },
                      height: { xs: 36, sm: 40 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props} key={option._id}>
                  <ListItemAvatar>
                    <Avatar
                      src={option.picture}
                      alt={option.name}
                      sx={{ width: 32, height: 32 }}
                    >
                      {getInitials(option.name, option.lastName)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${option.name} ${option.lastName}`}
                    secondary={`@${option.username}`}
                    primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
              )}
            />
          </Box>

          {loggedUser && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 0.5,
                pr: { xs: 0.5, sm: 2 },
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                flexShrink: 0,
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              }}
              onClick={() => navigate("/profile")}
            >
              <Avatar
                src={loggedUser.picture}
                alt={`${loggedUser.name} ${loggedUser.lastName}`}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: theme.palette.secondary.main,
                  border: (theme) =>
                    `2px solid ${theme.palette.background.paper}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
                imgProps={{ referrerPolicy: "no-referrer" }}
              >
                {getInitials(loggedUser.name, loggedUser.lastName)}
              </Avatar>
              <Box sx={{ display: { xs: "none", lg: "block" } }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: "text.primary",
                  }}
                >
                  {loggedUser.name} {loggedUser.lastName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                  }}
                >
                  {loggedUser.sportType || "Athlete"}
                </Typography>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Sidebar */}
      <NavigationSidebar
        mobileOpen={mobileOpen}
        onMobileClose={handleDrawerToggle}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: { xs: "24px 0 0 0", sm: "40px 0 0 0" },
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            overflow: isAiTipsPage ? "hidden" : "auto",
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            border: (theme) =>
              `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Box sx={{
            p: isAiTipsPage ? 0 : { xs: 1.5, sm: 3, md: 4 },
            flex: 1,
            minHeight: 0,
            display: isAiTipsPage ? "flex" : "block",
            flexDirection: "column"
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>

      {loggedUser && (
        <Zoom
          in={!hideFab}
          unmountOnExit
          timeout={theme.transitions.duration.enteringScreen}
        >
          <Fab
            aria-label="add workout"
            onClick={() => navigate("/workouts")}
            sx={{
              position: "fixed",
              background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
              color: "primary.contrastText",
              bottom: { xs: 16, sm: 24 },
              right: { xs: 16, sm: 24 },
              boxShadow: 3,
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.2s",
              },
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      )}
    </Box>
  );
};

export default Layout;
