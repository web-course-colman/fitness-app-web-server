import { Box } from "@mui/material";

const MobileNav = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "background.paper",
                borderTop: 1,
                borderColor: "divider",
                height: 56,
                zIndex: 1000,
            }}
        >
            {/* Mobile navigation will be implemented here */}
        </Box>
    );
};

export default MobileNav;
