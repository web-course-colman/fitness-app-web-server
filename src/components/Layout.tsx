import { useState } from "react";
import { Box, AppBar, Toolbar, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import NavigationSidebar, { DRAWER_WIDTH } from "./NavigationSidebar";

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* App Bar for mobile */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                        ml: { md: `${DRAWER_WIDTH}px` },
                        display: { xs: "block", md: "none" },
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            )}

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
                {isMobile && <Toolbar />}
                {/* <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box> */}
            </Box>
        </Box>
    );
};

export default Layout;
