import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Box, Link, Typography } from "@mui/material";
import { useStyles } from "./NotFound.styles";

const NotFound = () => {
    const classes = useStyles();
    const location = useLocation();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }, [location.pathname]);

    return (
        <Box sx={classes.page}>
            <Box sx={classes.content}>
                <Typography component="h1" sx={classes.code}>404</Typography>
                <Typography sx={classes.message}>Oops! Page not found</Typography>
                <Link href="/" sx={classes.link}>
                    Return to Home
                </Link>
            </Box>
        </Box>
    );
};

export default NotFound;
