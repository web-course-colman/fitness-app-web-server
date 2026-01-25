import { type ReactNode, createContext, useCallback, useContext, useState, useEffect } from 'react';
import api from '../../services/axios';
import axios, { HttpStatusCode } from 'axios';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const USER_DETAILS_KEY = 'user_details';

interface AuthContextType {
    isAuthenticated: boolean;
    loggedUser: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<LoginResult>;
    register: (username: string, password: string, name: string, lastName: string) => Promise<LoginResult>;
    logout: () => void;
}

export type User = {
    name: string;
    lastName: string;
    username: string;
    loggedInAt: number; // epoch time
};

interface LoginResult {
    success: boolean;
    error?: string;
    user?: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedUser, setLoggedUser] = useLocalStorage<User | null>(USER_DETAILS_KEY, null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = useCallback(async () => {
        try {
            const { data } = await api.get('/api/auth/profile');
            setLoggedUser({
                name: data.name,
                lastName: data.lastName,
                username: data.username,
                loggedInAt: Date.now(),
            });
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
            // Don't clear user immediately if just network error? 
            // But for auth check, usually 401 means not logged in.
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setLoggedUser(null);
            }
        } finally {
            setIsLoading(false);
        }
    }, [setLoggedUser]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = useCallback(async (username: string, password: string) => {
        if (!username || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        try {
            setIsLoading(true);
            await api.post('/api/auth/login', {
                username,
                password,
            });
            await checkAuthStatus();

            return { success: true, username };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error while login in', error);
                if (error.response?.status === HttpStatusCode.Unauthorized) {
                    return { success: false, error: 'Invalid email or password' };
                } else {
                    return { success: false, error: 'Something went wrong, please try again' };
                }
            } else {
                return { success: false, error: 'An unexpected error occurred while logging in' };
            }
        } finally {
            setIsLoading(false);
        }
    }, [checkAuthStatus]);

    const register = useCallback(async (username: string, password: string, name: string, lastName: string) => {
        if (!username || !password || !name || !lastName) {
            return { success: false, error: 'All fields are required' };
        }

        try {
            setIsLoading(true);

            await api.post('/api/auth/signin', {
                username,
                password,
                name,
                lastName
            });

            return { success: true };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error while registering', error);
                if (error.response?.status === HttpStatusCode.Conflict) {
                    return { success: false, error: 'Username already exists' };
                }
                return { success: false, error: error.response?.data?.message || 'Registration failed' };
            }
            return { success: false, error: 'An unexpected error occurred' };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error', error);
        }
        setIsAuthenticated(false);
        setLoggedUser(null);
        // Optional: window.location.href = '/login'; 
    }, [setLoggedUser]);

    const authState = {
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        login,
        register,
        logout,
        loggedUser
    };

    return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
