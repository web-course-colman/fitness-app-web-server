import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    // TODO: Add authentication check
    // const { user } = useAuth();
    // if (!user) {
    //     return <Navigate to="/login" replace />;
    // }
    
    return <>{children}</>;
};

export default ProtectedRoute;
