import { useAuth } from "@/components/Auth/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./Index.styles";

const Index = () => {
    useStyles();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/feed");
        } else {
            navigate("/login");
        }
    }, [navigate, isAuthenticated]);

    return null;
};

export default Index;
