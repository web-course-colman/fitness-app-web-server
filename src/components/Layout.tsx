import { useState } from "react";
import { Avatar, Box, AppBar, Toolbar, IconButton, useTheme, useMediaQuery, Typography, Fab, Zoom } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu as MenuIcon, Add as AddIcon } from "@mui/icons-material";
import NavigationSidebar, { DRAWER_WIDTH, COLLAPSED_WIDTH } from "./NavigationSidebar";
import { useAuth } from "./Auth/AuthProvider";

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { loggedUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isWorkoutPage = location.pathname === "/workouts";

    const currentDrawerWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const getInitials = (name: string, lastName: string) => {
        return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${currentDrawerWidth}px)` },
                    ml: { md: `${currentDrawerWidth}px` },
                    transition: theme.transitions.create(["width", "margin"], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            {/* Page Title can go here, or keep it simple */}
                            FitTrack
                        </Typography>
                    </Box>

                    {loggedUser && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography variant="body1" sx={{ display: { xs: "none", sm: "block" } }}>
                                {loggedUser.name} {loggedUser.lastName}
                            </Typography>
                            <Avatar
                                src={loggedUser.picture}
                                alt={`${loggedUser.name} ${loggedUser.lastName}`}
                                sx={{ bgcolor: theme.palette.secondary.main }}
                                imgProps={{ referrerPolicy: "no-referrer" }}
                            >
                                {getInitials(loggedUser.name, loggedUser.lastName)}
                            </Avatar>
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
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    transition: theme.transitions.create(["width", "margin"], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar /> {/* Spacer for fixed AppBar */}
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <Outlet />
                </Box>
            </Box>

            {loggedUser && (
                <Zoom
                    in={!isWorkoutPage}
                    unmountOnExit
                    timeout={theme.transitions.duration.enteringScreen}
                >
                    <Fab
                        color="primary"
                        aria-label="add workout"
                        onClick={() => navigate("/workouts")}
                        sx={{
                            position: "fixed",
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
