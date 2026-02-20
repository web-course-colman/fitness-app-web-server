import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { AchievementUnlockNotification } from "@/hooks/useNotifications";

interface Props {
  achievement: AchievementUnlockNotification | null;
  open: boolean;
  onClose: () => void;
  onShare: () => void;
}

const AchievementUnlockedModal = ({
  achievement,
  open,
  onClose,
  onShare,
}: Props) => {
  if (!achievement) return null;

  const tierLabel =
    achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
        Achievement Unlocked
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            component="img"
            src={achievement.icon}
            alt={achievement.achievementName}
            sx={{ width: 120, height: 120, objectFit: "contain" }}
          />
        </Box>
        <Typography variant="h6" textAlign="center" sx={{ fontWeight: 700 }}>
          {achievement.achievementName}
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary">
          {tierLabel} tier unlocked
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="text" fullWidth>
          Later
        </Button>
        <Button onClick={onShare} variant="contained" fullWidth>
          Share as Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AchievementUnlockedModal;
