import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import AppThemeProvider from "@/components/Theme/AppThemeProvider";
import Index from "@/pages/index";
import Login from "@/pages/Login";
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";
import Preferences from "@/pages/Preferences";
import NotFound from "@/pages/NotFound";

import WorkoutPost from "@/pages/WorkoutPost";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
<<<<<<< HEAD
                <Routes>
                    <Route path="/ai-tips" element={
                        // TODO
                        <div></div>
                    } />
                </Routes>
=======
                <AuthProvider>
                    <AppThemeProvider>
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/login" element={<Login />} />
                            <Route element={<ProtectedRoute />}>
                                <Route element={<Layout />}>
                                    <Route path="/feed" element={<Feed />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/workouts" element={<WorkoutPost />} />
                                    <Route path="/preferences" element={<Preferences />} />
                                </Route>
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </AppThemeProvider>
                </AuthProvider>
>>>>>>> d72c7bfe567cd9712cc393c6533609f0c8046646
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
