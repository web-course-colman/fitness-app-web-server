import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  FitnessCenter,
  Google,
} from "@mui/icons-material";
import { useAuth } from "@/components/Auth/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { useStyles } from "./Login.styles";

const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (!result.success) {
          toast({
            title: "Sign in failed",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          navigate("/feed");
        }
      } else {
        if (!name.trim()) {
          toast({
            title: "Name required",
            description: "Please enter your full name.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0];
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User";

        const result = await register(email, password, firstName, lastName);

        if (!result.success) {
          toast({
            title: "Sign up failed",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created!",
            description: "Account created! Please sign in.",
          });
          setIsLogin(true); // Switch to login mode
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={classes.page}>
      <Box sx={classes.content}>
        {/* Logo */}
        <Box sx={classes.logoSection}>
          <Box sx={classes.logoCircle}>
            <FitnessCenter sx={classes.logoIcon} />
          </Box>
          <Typography variant="h3" component="h1" fontWeight="bold">
            FitTrack
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your personal fitness companion
          </Typography>
        </Box>

        <Card>
          <CardContent sx={classes.cardContent}>
            <Box sx={classes.formHeader}>
              <Typography variant="h5" component="h2" gutterBottom>
                {isLogin ? "Welcome back" : "Create account"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Sign up to start your fitness journey"}
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={classes.form}
            >
              {!isLogin && (
                <TextField
                  id="name"
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  disabled={loading}
                  fullWidth
                />
              )}

              <TextField
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                fullWidth
              />

              <TextField
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={classes.submitButton}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  const port = import.meta.env.VITE_SERVER_PORT || '3002';
                  const serverUrl = import.meta.env.VITE_SERVER_URL || `http://localhost:${port}`;
                  window.location.href = `${serverUrl}/api/auth/google`;
                }}
                startIcon={<Google />}
                sx={classes.googleButton}
                disabled={loading}
              >
                Sign in with Google
              </Button>
            </Box>

            <Box sx={classes.footer}>
              <Button
                type="button"
                variant="text"
                size="small"
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
