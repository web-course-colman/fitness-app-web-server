import axios from 'axios';
import { toast } from '../hooks/use-toast';

const api = axios.create({
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 429) {
            toast({
                title: 'Rate Limit Exceeded',
                description: 'Please try again in a few minutes.',
                variant: 'destructive',
            });
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.get('/api/auth/refresh', { withCredentials: true });
                return api(originalRequest);
            } catch (refreshError) {
                // Only redirect if not already on login page to avoid infinite loops
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
