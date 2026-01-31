import { Navigate, Outlet, useLocation } from 'react-router';
import { Box, CircularProgress } from '@mui/material';

import { useAuth } from './AuthProvider';

export const ProtectedRoute = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate to='/login' replace state={{ from: location }} />
	);
};
