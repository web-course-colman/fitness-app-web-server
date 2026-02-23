import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import AppThemeProvider from "@/components/Theme/AppThemeProvider";
import Index from "@/pages/Home/Index";
import Login from "@/pages/Login/Login";
import Feed from "@/pages/Feed/Feed";
import Profile from "@/pages/Profile/Profile";
import Achievements from "@/pages/Achievements/Achievements";
import EditProfile from "@/pages/EditProfile/EditProfile";
import Preferences from "@/pages/Preferences/Preferences";
import NotFound from "@/pages/NotFound/NotFound";

import WorkoutPost from "@/pages/WorkoutPost/WorkoutPost";
import PostPage from "@/pages/PostPage/PostPage";
import AiTips from "@/pages/AiTips/AiTips";
import AuthCallback from "@/pages/AuthCallback/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppThemeProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/app/auth/callback" element={<AuthCallback />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/workouts" element={<WorkoutPost />} />
                  <Route path="/posts/:postId" element={<PostPage />} />
                  <Route path="/ai-tips" element={<AiTips />} />
                  <Route path="/preferences" element={<Preferences />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
