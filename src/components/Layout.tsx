import { useState } from "react";
import { Avatar, Box, AppBar, Toolbar, IconButton, useTheme, useMediaQuery, Typography, Fab, Zoom, alpha, Paper } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu as MenuIcon, Add as AddIcon } from "@mui/icons-material";
import NavigationSidebar, { DRAWER_WIDTH, COLLAPSED_WIDTH } from "./NavigationSidebar";
import { useAuth } from "./Auth/AuthProvider";

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebar-collapsed");
        return saved ? JSON.parse(saved) : false;
    });
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
        setIsCollapsed((prev: boolean) => {
            const newState = !prev;
            localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
            return newState;
        });
    };

    const getInitials = (name: string, lastName: string) => {
        return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const getPageTitle = (pathname: string) => {
        const titles: Record<string, string> = {
            "/feed": "Feed",
            "/workouts": "New Workout",
            "/ai-tips": "AI Coacher",
            "/profile": "Profile",
            "/preferences": "Settings",
        };
        return titles[pathname] || "FitTrack";
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#f1f5f9',
                overflow: "hidden"
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
                    zIndex: (theme) => theme.zIndex.drawer + 1,
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
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                            {getPageTitle(location.pathname)}
                        </Typography>
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
                                "&:hover": {
                                    transform: "translateY(-1px)",
                                },
                            }}
                        >
                            <Avatar
                                src={loggedUser.picture}
                                alt={`${loggedUser.name} ${loggedUser.lastName}`}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: theme.palette.secondary.main,
                                    border: (theme) => `2px solid ${theme.palette.background.paper}`,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                }}
                                imgProps={{ referrerPolicy: "no-referrer" }}
                            >
                                {getInitials(loggedUser.name, loggedUser.lastName)}
                            </Avatar>
                            <Box sx={{ display: { xs: "none", sm: "block" } }}>
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
                                    Athlete
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
                        overflow: "auto",
                        position: "relative",
                        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    }}
                >
                    <Box sx={{ p: { xs: 2, sm: 4 } }}>
                        <Outlet />
                    </Box>
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
