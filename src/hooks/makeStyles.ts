import { Theme, useTheme } from "@mui/material/styles";

/**
 * A simple makeStyles-like utility for MUI 5/6.
 * Returns a hook that provides the styles object.
 */
export const makeStyles = <T extends Record<string, any>>(
    styles: (theme: Theme) => T
) => {
    return () => {
        const theme = useTheme();
        return styles(theme);
    };
};
