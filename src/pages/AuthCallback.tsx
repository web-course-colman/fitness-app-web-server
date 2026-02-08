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

            // 1. Always ensure Web Session is valid (for fallback or desktop)
            try {
                await refreshProfile();
            } catch (error) {
                console.error("Failed to refresh profile", error);
                // If profile refresh fails, we might still want to try the app redirect if we have params?
                // But for now let's assume if this fails, something is wrong.
                // We'll continue to try redirecting to app if params exist.
            }

            // 2. Check for Mobile
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (isMobile && accessToken && userId && refreshToken) {
                // Construct Intent URL with fallback
                const fallbackUrl = encodeURIComponent(`${window.location.origin}/feed`);
                const intentUrl = `intent://node86.cs.colman.ac.il/app/auth/callback?code=${accessToken}&userId=${userId}&refreshToken=${refreshToken}#Intent;scheme=https;package=com.fitness.app;S.browser_fallback_url=${fallbackUrl};end`;

                // Redirect to Intent
                window.location.href = intentUrl;
            } else {
                // Desktop or missing params -> Go to Web Feed
                navigate('/feed');
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
