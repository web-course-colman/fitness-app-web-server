import { Box, Card, Avatar, Typography, Button } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useStyles } from "../../pages/Profile.styles";

interface ProfileHeaderProps {
    name: string;
    handle: string;
    bio: string;
    avatarUrl?: string;
    initials: string;
}

const ProfileHeader = ({ name, handle, bio, avatarUrl, initials }: ProfileHeaderProps) => {
    const classes = useStyles();

    return (
        <Card sx={classes.profileCard}>
            <Box sx={classes.userInfo}>
                <Avatar src={avatarUrl} sx={classes.avatar}>
                    {initials}
                </Avatar>
                <Box sx={classes.details}>
                    <Typography variant="h5" sx={classes.userName}>
                        {name}
                    </Typography>
                    <Typography variant="body1" sx={classes.userHandle}>
                        {handle}
                    </Typography>
                    <Typography variant="body2" sx={classes.bio}>
                        {bio}
                    </Typography>
                </Box>
            </Box>
            <Button
                variant="outlined"
                fullWidth
                startIcon={<EditIcon />}
                sx={classes.editButton}
            >
                Edit Profile
            </Button>
        </Card>
    );
};

export default ProfileHeader;
