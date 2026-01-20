import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Feed from "@/pages/Feed";

const queryClient = new QueryClient();

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
    },
});

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/feed" element={
                                <Feed />
                            } />

                        </Routes>
                    </Layout>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;
