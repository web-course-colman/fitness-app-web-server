import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/Auth/AuthProvider';
import { CircularProgress, Box, Typography } from '@mui/material';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshProfile } = useAuth();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const handleCallback = async () => {
            const accessToken = searchParams.get('code');
            const refreshToken = searchParams.get('refreshToken');
            const userId = searchParams.get('userId');

            if (accessToken && refreshToken && userId) {
                // Manually set cookies if needed, but optimally the backend should have set httpOnly cookies.
                // However, since we are receiving tokens in the URL, we might need to store them.
                // The backend implementation in AuthController sets cookies on the response.
                // The client redirect receives them in query params too?
                // Let's look at the backend code again.
                // Backend: res.redirect(`${redirectUrl}?code=${tokens.access_token}&userId=${user._id}&refreshToken=${tokens.refresh_token}`);
                // AND it sets cookies.

                // If the backend sets cookies, we might just need to trigger a profile refresh.
                try {
                    await refreshProfile();
                    navigate('/feed');
                } catch (error) {
                    console.error("Failed to refresh profile during callback", error);
                    navigate('/login?error=auth_failed');
                }
            } else {
                // Even if params are missing, maybe cookies are set?
                try {
                    await refreshProfile();
                    navigate('/feed');
                } catch (error) {
                    console.error("Failed to refresh profile with missing params", error);
                    navigate('/login?error=missing_params');
                }
            }
        };

        handleCallback();
    }, [searchParams, navigate, refreshProfile]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
                Completing login...
            </Typography>
        </Box>
    );
};

export default AuthCallback;
