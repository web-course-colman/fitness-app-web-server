import { type ReactNode, createContext, useCallback, useContext, useState } from 'react';
import api from '../../services/axios';
import axios, { HttpStatusCode } from 'axios';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const ACCESS_TOKEN_KEY = 'access_token';
export const USER_DETAILS_KEY = 'user_details';

// TODO: move to cookies instead of local storage

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
    loggedInAt: number; // epoch time
};

interface LoginResult {
    success: boolean;
    error?: string;
    user?: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [loggedUser, setLoggedUser] = useLocalStorage<User | null>(USER_DETAILS_KEY, null);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(async (username: string, password: string) => {
        if (!username || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        try {
            setIsLoading(true);

            const response = await api.post('/api/auth/login', {
                username,
                password,
            });
            const jwt = response.data.access_token;
            localStorage.setItem(ACCESS_TOKEN_KEY, jwt);
            setIsAuthenticated(true);

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
    }, []);

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

            // Auto login after registration or just return success? 
            // The prompt says "store the user on signin... and validate on login".
            // Usually we might auto-login or ask user to login. 
            // For now, let's return success and let UI decide.

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

    const logout = useCallback(() => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setIsAuthenticated(false);
        setLoggedUser(null);
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
