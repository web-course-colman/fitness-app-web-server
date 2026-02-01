import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Avatar, Paper, CircularProgress, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAuth } from '@/components/Auth/AuthProvider';
import api from '@/services/axios';
import { toast } from 'sonner';

interface EditProfileState {
    username: string;
    email: string;
    picture: string;
    description: string;
    sportType: string;
}

const EditProfile = () => {
    const { loggedUser, refreshProfile, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<EditProfileState>({
        username: '',
        email: '',
        picture: '',
        description: '',
        sportType: 'Athlete'
    });

    useEffect(() => {
        if (loggedUser) {
            setFormData({
                username: loggedUser.username || '',
                email: loggedUser.email || '',
                picture: loggedUser.picture || '',
                description: loggedUser.description || '',
                sportType: loggedUser.sportType || ''
            });
        }
    }, [loggedUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.username.trim() || formData.username.length < 3) {
            toast.error('Username must be at least 3 characters');
            return;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            toast.error('Please enter a valid email');
            return;
        }

        try {
            setIsLoading(true);

            // Clean payload
            const payload = {
                username: formData.username,
                email: formData.email,
                picture: formData.picture,
                description: formData.description,
                sportType: formData.sportType
            };

            await api.post('/api/auth/profile', payload);

            toast.success('Profile updated successfully');
            await refreshProfile();
            navigate('/profile');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ mx: 'auto', maxHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', width: '80%' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, minHeight: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '2.4rem' }}>
                        <Avatar
                            src={formData.picture || loggedUser?.picture}
                            sx={{ width: 200, height: 200, border: '4px solid', borderColor: 'primary.main' }}
                        >
                            {loggedUser?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                            Preview
                        </Typography>
                    </Box>

                    <Stack spacing={3} sx={{ width: '100%', padding: '2.4rem' }}>
                        <TextField
                            label="Username"
                            name="username"
                            fullWidth
                            value={formData.username}
                            onChange={handleChange}
                            required
                            helperText={formData.username.length < 3 ? "Minimum 3 characters" : ""}
                            error={formData.username.length > 0 && formData.username.length < 3}
                        />

                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                            required
                            type="email"
                        />

                        <TextField
                            label="Bio / Description"
                            name="description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            helperText="Share your fitness journey, goals, or interests"
                        />

                        <FormControl fullWidth>
                            <InputLabel id="sport-type-label">Sport Type</InputLabel>
                            <Select
                                labelId="sport-type-label"
                                id="sport-type"
                                name="sportType"
                                value={formData.sportType}
                                label="Sport Type"
                                onChange={(e) => setFormData(prev => ({ ...prev, sportType: e.target.value }))}
                            >
                                <MenuItem value="Athlete">Athlete</MenuItem>
                                <MenuItem value="Runner">Runner</MenuItem>
                                <MenuItem value="Cyclist">Cyclist</MenuItem>
                                <MenuItem value="Swimmer">Swimmer</MenuItem>
                                <MenuItem value="Weightlifter">Weightlifter</MenuItem>
                                <MenuItem value="Bodybuilder">Bodybuilder</MenuItem>
                                <MenuItem value="CrossFit">CrossFit</MenuItem>
                                <MenuItem value="Yoga Practitioner">Yoga Practitioner</MenuItem>
                                <MenuItem value="Martial Artist">Martial Artist</MenuItem>
                                <MenuItem value="Climber">Climber</MenuItem>
                                <MenuItem value="Dancer">Dancer</MenuItem>
                                <MenuItem value="Fitness Enthusiast">Fitness Enthusiast</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Profile Picture URL"
                            name="picture"
                            fullWidth
                            value={formData.picture}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            helperText="Enter a valid image URL"
                        />
                    </Stack>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 'auto', pt: 2, width: '80%', mx: 'auto' }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate('/profile')}
                        disabled={isLoading}
                        type="button"
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
            </form>
        </Box>
    );
};

export default EditProfile;
