import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Typography,
    Divider,
    IconButton,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Home,
    FitnessCenter,
    Person,
    TrendingUp,
    Settings,
    Menu as MenuIcon,
    Close,
    ChevronLeft,
    ChevronRight,
} from "@mui/icons-material";

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

interface NavigationItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
    { label: "Feed", path: "/feed", icon: <Home /> },
    { label: "Workouts", path: "/workouts", icon: <FitnessCenter /> },
    { label: "Progress", path: "/progress", icon: <TrendingUp /> },
    { label: "Profile", path: "/profile", icon: <Person /> },
    { label: "Settings", path: "/preferences", icon: <Settings /> },
];

interface NavigationSidebarProps {
    mobileOpen: boolean;
    onMobileClose: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const NavigationSidebar = ({ mobileOpen, onMobileClose, isCollapsed, onToggleCollapse }: NavigationSidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            onMobileClose();
        }
    };

    const drawerContent = (
        <Box>
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isCollapsed ? "center" : "space-between",
                    px: isCollapsed ? 1 : 2,
                    minHeight: "64px !important",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FitnessCenter sx={{ color: "primary.main", fontSize: 28 }} />
                    {!isCollapsed && (
                        <Typography variant="h6" component="div" fontWeight="bold" noWrap>
                            FitTrack
                        </Typography>
                    )}
                </Box>
                {isMobile ? (
                    <IconButton onClick={onMobileClose} edge="end">
                        <Close />
                    </IconButton>
                ) : (
                    <IconButton
                        onClick={onToggleCollapse}
                        size="small"
                        sx={{
                            display: { xs: "none", md: "inline-flex" },
                            position: isCollapsed ? "relative" : "static",
                        }}
                    >
                        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                    </IconButton>
                )}
            </Toolbar>
            <Divider />
            <List sx={{ px: 1, py: 2 }}>
                {navigationItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                selected={isActive}
                                sx={{
                                    borderRadius: 2,
                                    "&.Mui-selected": {
                                        bgcolor: "primary.main",
                                        color: "primary.contrastText",
                                        "&:hover": {
                                            bgcolor: "primary.dark",
                                        },
                                        "& .MuiListItemIcon-root": {
                                            color: "primary.contrastText",
                                        },
                                    },
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? "primary.contrastText" : "inherit",
                                        minWidth: isCollapsed ? 0 : 40,
                                        justifyContent: "center",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {!isCollapsed && (
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 600 : 400,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <>
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: DRAWER_WIDTH,
                    },
                }}
            >
                {drawerContent}
            </Drawer>
            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
                        transition: theme.transitions.create("width", {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        overflowX: "hidden",
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default NavigationSidebar;
export { DRAWER_WIDTH, COLLAPSED_WIDTH };
