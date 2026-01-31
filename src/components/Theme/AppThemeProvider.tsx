import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo } from "react";
import { useAuth } from "../Auth/AuthProvider";

interface AppThemeProviderProps {
    children: React.ReactNode;
}

const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
    const { loggedUser } = useAuth();

    // Default to light mode if preference is missing or not yet loaded
    const isDarkMode = loggedUser?.preferences?.darkMode ?? false;

    const theme = useMemo(() => createTheme({
        palette: {
            mode: isDarkMode ? "dark" : "light",
            primary: {
                main: "#1976d2",
            },
            secondary: {
                main: "#dc004e",
            },
            background: {
                default: isDarkMode ? "#121212" : "#f8f9fa",
                paper: isDarkMode ? "#1e1e1e" : "#ffffff",
            },
        },
        components: {
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: isDarkMode ? "#2c2c2c" : "transparent",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.87)" : "rgba(0, 0, 0, 0.87)",
                        },
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        color: isDarkMode ? "#ffffff" : "inherit",
                        "&.Mui-focused": {
                            color: isDarkMode ? "#ffffff" : "#1976d2",
                        },
                    },
                },
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        color: isDarkMode ? "#ffffff" : "inherit",
                    },
                },
            },
        },
    }), [isDarkMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default AppThemeProvider;
