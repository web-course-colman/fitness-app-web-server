import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Avatar, Paper, CircularProgress, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAuth } from '@/components/Auth/AuthProvider';
import api from '@/services/axios';
import { toast } from 'sonner';
import { useStyles } from './EditProfile.styles';

interface EditProfileState {
    username: string;
    email: string;
    picture: string;
    description: string;
    sportType: string;
}

const EditProfile = () => {
    const classes = useStyles();
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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

            // Create FormData for multipart upload
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('sportType', formData.sportType);

            // Only append picture URL if no file is selected
            if (!selectedFile && formData.picture) {
                formDataToSend.append('picture', formData.picture);
            }

            // Append file if selected
            if (selectedFile) {
                formDataToSend.append('file', selectedFile);
            }

            const response = await api.post('/api/auth/profile', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Profile update response:', response.data);
            toast.success('Profile updated successfully');
            await refreshProfile();
            navigate('/profile');
        } catch (error: any) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={classes.container}>
            <Box component="form" onSubmit={handleSubmit} sx={classes.form}>
                <Box sx={classes.contentRow}>
                    <Box sx={classes.leftColumn}>
                        <Avatar
                            src={previewUrl || formData.picture || loggedUser?.picture}
                            sx={classes.avatar}
                        >
                            {loggedUser?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                            Preview
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            size="small"
                        >
                            Upload Avatar
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {selectedFile && (
                            <Typography variant="caption" color="primary">
                                {selectedFile.name}
                            </Typography>
                        )}
                    </Box>

                    <Stack spacing={3} sx={classes.rightColumn}>
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

                <Box sx={classes.actions}>
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
            </Box>
        </Box>
    );
};

export default EditProfile;
