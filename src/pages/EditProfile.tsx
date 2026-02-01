import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Avatar, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '@/components/Auth/AuthProvider';
import api from '@/services/axios';
import { toast } from 'sonner';

interface EditProfileForm {
    username: string;
    picture: string;
}

const EditProfile = () => {
    const { loggedUser, refreshProfile, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<EditProfileForm>({
        defaultValues: {
            username: loggedUser?.username || '',
            picture: loggedUser?.picture || ''
        }
    });

    useEffect(() => {
        if (loggedUser) {
            reset({
                username: loggedUser.username,
                picture: loggedUser.picture || ''
            });
        }
    }, [loggedUser, reset]);

    const watchedPicture = watch('picture');

    if (authLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    const onSubmit = async (data: EditProfileForm) => {
        try {
            setIsLoading(true);
            await api.post('/api/auth/profile', data);
            await refreshProfile();
            toast.success('Profile updated successfully');
            navigate('/profile');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" mb={4} fontWeight="bold" textAlign="center">
                    Edit Profile
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={watchedPicture || loggedUser?.picture}
                            sx={{ width: 100, height: 100, border: '4px solid', borderColor: 'primary.main' }}
                        >
                            {loggedUser?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                            Preview
                        </Typography>
                    </Box>

                    <TextField
                        label="Username"
                        fullWidth
                        {...register('username', {
                            required: 'Username is required',
                            minLength: { value: 3, message: 'Username must be at least 3 characters' }
                        })}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />

                    <TextField
                        label="Profile Picture URL"
                        fullWidth
                        {...register('picture', {
                            pattern: {
                                value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                                message: 'Invalid URL format'
                            }
                        })}
                        error={!!errors.picture}
                        helperText={errors.picture?.message}
                        placeholder="https://example.com/avatar.jpg"
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/profile')}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default EditProfile;
