import { useState } from "react";
import { Avatar, Box, AppBar, Toolbar, IconButton, useTheme, useMediaQuery, Typography } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import NavigationSidebar, { DRAWER_WIDTH } from "./NavigationSidebar";
import { useAuth } from "./Auth/AuthProvider";

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { loggedUser } = useAuth();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const getInitials = (name: string, lastName: string) => {
        return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { md: `${DRAWER_WIDTH}px` },
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
                            >
                                {getInitials(loggedUser.name, loggedUser.lastName)}
                            </Avatar>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Navigation Sidebar */}
            <NavigationSidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    minHeight: "100vh",
                    bgcolor: "background.default",
                }}
            >
                <Toolbar /> {/* Spacer for fixed AppBar */}
                {/* <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box> */}
            </Box>
        </Box>
    );
};

export default Layout;
