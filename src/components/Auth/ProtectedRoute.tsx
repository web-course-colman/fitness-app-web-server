import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuth } from './AuthProvider';

export const ProtectedRoute = () => {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	return isAuthenticated ? (
		<Outlet /> // renders child route element(s)
	) : (
		<Navigate to='/login' replace state={{ from: location }} />
	);
};
