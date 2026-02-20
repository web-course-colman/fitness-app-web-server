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
  AutoAwesome,
  EmojiEvents,
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
  { label: "AI Tips", path: "/ai-tips", icon: <AutoAwesome /> },
  { label: "Achievements", path: "/achievements", icon: <EmojiEvents /> },
  { label: "Profile", path: "/profile", icon: <Person /> },
  { label: "Settings", path: "/preferences", icon: <Settings /> },
];

interface NavigationSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const NavigationSidebar = ({
  mobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}: NavigationSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const showFullContent = !isCollapsed || isMobile;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onMobileClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: !showFullContent ? "center" : "space-between",
            px: !showFullContent ? 1 : 2,
            minHeight: "64px !important",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            onClick={() => handleNavigation("/feed")}
          >
            <FitnessCenter sx={{ color: "primary.main", fontSize: 28 }} />
            {showFullContent && (
              <Typography variant="h6" component="div" fontWeight="bold" noWrap>
                FitTrack
              </Typography>
            )}
          </Box>
          {isMobile && (
            <IconButton onClick={onMobileClose} edge="end">
              <Close />
            </IconButton>
          )}
        </Toolbar>
        <Divider sx={{ width: "80%", margin: "0 auto" }} />
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
                      background:
                        "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
                      color: "primary.contrastText",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #4f46e5 0%, #9333ea 100%)",
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
                  {!showFullContent ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        gap: 0.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive ? "primary.contrastText" : "inherit",
                          minWidth: 0,
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.55rem",
                          fontWeight: 600,
                          lineHeight: 1,
                          textAlign: "center",
                          color: isActive
                            ? "primary.contrastText"
                            : "text.secondary",
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <ListItemIcon
                        sx={{
                          color: isActive ? "primary.contrastText" : "inherit",
                          minWidth: 40,
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: isActive ? 600 : 400,
                        }}
                      />
                    </>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {!isMobile && (
        <Box sx={{ mt: "auto" }}>
          <Divider />
          <Box sx={{ p: 1, pb: 2 }}>
            <ListItemButton
              onClick={onToggleCollapse}
              sx={{
                borderRadius: 2,
                py: 1.5,
                transition: theme.transitions.create(["all"], {
                  duration: theme.transitions.duration.shorter,
                }),
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              {isCollapsed ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    gap: 0.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "text.secondary",
                      minWidth: 0,
                      justifyContent: "center",
                    }}
                  >
                    <ChevronRight />
                  </ListItemIcon>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      lineHeight: 1,
                      textAlign: "center",
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Expand
                  </Typography>
                </Box>
              ) : (
                <>
                  <ListItemIcon
                    sx={{
                      color: "text.secondary",
                      minWidth: 40,
                      justifyContent: "center",
                    }}
                  >
                    <ChevronLeft />
                  </ListItemIcon>
                  <ListItemText
                    primary="Collapse Sidebar"
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "text.secondary",
                    }}
                  />
                </>
              )}
            </ListItemButton>
          </Box>
        </Box>
      )}
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
            bgcolor: "transparent",
            border: "none",
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
