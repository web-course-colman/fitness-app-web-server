import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { useAuth } from "@/components/Auth/AuthProvider";
import api from "@/services/axios";
import { toast } from "sonner";
import { useStyles } from "./EditProfile.styles";
import { useUserProfileForEdit } from "@/hooks/useAi";

interface EditProfileState {
  username: string;
  email: string;
  picture: string;
  description: string;
  sportType: string;
}

interface FitnessFormState {
  height: string;
  currentWeight: string;
  age: string;
  sex: string;
  bodyFatPercentage: string;
  vo2max: string;
  oneRmSquat: string;
  oneRmBench: string;
  oneRmDeadlift: string;
  workoutsPerWeek: string;
}

const emptyFitness: FitnessFormState = {
  height: "",
  currentWeight: "",
  age: "",
  sex: "",
  bodyFatPercentage: "",
  vo2max: "",
  oneRmSquat: "",
  oneRmBench: "",
  oneRmDeadlift: "",
  workoutsPerWeek: "",
};

const EditProfile = () => {
  const classes = useStyles();
  const { loggedUser, refreshProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userProfile } = useUserProfileForEdit();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<EditProfileState>({
    username: "",
    email: "",
    picture: "",
    description: "",
    sportType: "Athlete",
  });
  const [fitnessData, setFitnessData] =
    useState<FitnessFormState>(emptyFitness);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (loggedUser) {
      setFormData({
        username: loggedUser.username || "",
        email: loggedUser.email || "",
        picture: loggedUser.picture || "",
        description: loggedUser.description || "",
        sportType: loggedUser.sportType || "",
      });
    }
  }, [loggedUser]);

  useEffect(() => {
    if (userProfile !== undefined && userProfile !== null) {
      setFitnessData({
        height: userProfile.height != null ? String(userProfile.height) : "",
        currentWeight:
          userProfile.currentWeight != null
            ? String(userProfile.currentWeight)
            : "",
        age: userProfile.age != null ? String(userProfile.age) : "",
        sex: userProfile.sex || "",
        bodyFatPercentage:
          userProfile.bodyFatPercentage != null
            ? String(userProfile.bodyFatPercentage)
            : "",
        vo2max: userProfile.vo2max != null ? String(userProfile.vo2max) : "",
        oneRmSquat:
          userProfile.oneRm?.squat != null
            ? String(userProfile.oneRm.squat)
            : "",
        oneRmBench:
          userProfile.oneRm?.bench != null
            ? String(userProfile.oneRm.bench)
            : "",
        oneRmDeadlift:
          userProfile.oneRm?.deadlift != null
            ? String(userProfile.oneRm.deadlift)
            : "",
        workoutsPerWeek:
          userProfile.workoutsPerWeek != null
            ? String(userProfile.workoutsPerWeek)
            : "",
      });
    } else if (userProfile === null) {
      setFitnessData(emptyFitness);
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFitnessChange =
    (field: keyof FitnessFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFitnessData((prev) => ({ ...prev, [field]: e.target.value }));
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
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("sportType", formData.sportType);

      // Only append picture URL if no file is selected
      if (!selectedFile && formData.picture) {
        formDataToSend.append("picture", formData.picture);
      }

      // Append file if selected
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      const response = await api.post("/api/auth/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Upsert user-profiles (fitness & stats)
      if (loggedUser?.userId) {
        const parseNum = (s: string) => {
          const t = s.trim();
          if (t === "") return undefined;
          const n = Number(t);
          return isNaN(n) ? undefined : n;
        };
        const oneRmSquat = parseNum(fitnessData.oneRmSquat);
        const oneRmBench = parseNum(fitnessData.oneRmBench);
        const oneRmDeadlift = parseNum(fitnessData.oneRmDeadlift);
        await api.post("/api/user-profiles", {
          userId: loggedUser.userId,
          profileSummaryText: userProfile?.profileSummaryText ?? "",
          profileSummaryJson: userProfile?.profileSummaryJson ?? {},
          version: userProfile?.version ?? 1,
          ...(parseNum(fitnessData.height) != null && {
            height: parseNum(fitnessData.height),
          }),
          ...(parseNum(fitnessData.currentWeight) != null && {
            currentWeight: parseNum(fitnessData.currentWeight),
          }),
          ...(parseNum(fitnessData.age) != null && {
            age: parseNum(fitnessData.age),
          }),
          ...(fitnessData.sex && {
            sex: fitnessData.sex as "male" | "female" | "other",
          }),
          ...(parseNum(fitnessData.bodyFatPercentage) != null && {
            bodyFatPercentage: parseNum(fitnessData.bodyFatPercentage),
          }),
          ...(parseNum(fitnessData.vo2max) != null && {
            vo2max: parseNum(fitnessData.vo2max),
          }),
          ...((oneRmSquat != null ||
            oneRmBench != null ||
            oneRmDeadlift != null) && {
            oneRm: {
              ...(oneRmSquat != null && { squat: oneRmSquat }),
              ...(oneRmBench != null && { bench: oneRmBench }),
              ...(oneRmDeadlift != null && { deadlift: oneRmDeadlift }),
            },
          }),
          ...(parseNum(fitnessData.workoutsPerWeek) != null && {
            workoutsPerWeek: parseNum(fitnessData.workoutsPerWeek),
          }),
        });
        queryClient.invalidateQueries({
          queryKey: ["user-profile-edit", loggedUser.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["user-profile-summary", loggedUser.userId],
        });
      }

      console.log("Profile update response:", response.data);
      toast.success("Profile updated successfully");
      await refreshProfile();
      navigate("/profile");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
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
            <Button variant="outlined" component="label" size="small">
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
              helperText={
                formData.username.length < 3 ? "Minimum 3 characters" : ""
              }
              error={
                formData.username.length > 0 && formData.username.length < 3
              }
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sportType: e.target.value,
                  }))
                }
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
                <MenuItem value="Fitness Enthusiast">
                  Fitness Enthusiast
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Fitness & stats
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Height (cm)"
            type="number"
            inputProps={{ min: 50, max: 250, step: 1 }}
            fullWidth
            value={fitnessData.height}
            onChange={handleFitnessChange("height")}
          />
          <TextField
            label="Current weight (kg)"
            type="number"
            inputProps={{ min: 20, max: 500, step: 0.1 }}
            fullWidth
            value={fitnessData.currentWeight}
            onChange={handleFitnessChange("currentWeight")}
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Age"
            type="number"
            inputProps={{ min: 1, max: 120 }}
            fullWidth
            value={fitnessData.age}
            onChange={handleFitnessChange("age")}
          />
          <FormControl fullWidth>
            <InputLabel id="sex-label">Sex</InputLabel>
            <Select
              labelId="sex-label"
              label="Sex"
              value={fitnessData.sex}
              onChange={(e) =>
                setFitnessData((prev) => ({ ...prev, sex: e.target.value }))
              }
            >
              <MenuItem value="">—</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Body fat (%)"
            type="number"
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            fullWidth
            value={fitnessData.bodyFatPercentage}
            onChange={handleFitnessChange("bodyFatPercentage")}
          />
          <TextField
            label="VO₂max (ml/kg/min)"
            type="number"
            inputProps={{ min: 10, max: 100, step: 0.1 }}
            fullWidth
            value={fitnessData.vo2max}
            onChange={handleFitnessChange("vo2max")}
          />
        </Stack>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
          1RM (kg)
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Squat"
            type="number"
            inputProps={{ min: 0, step: 0.5 }}
            fullWidth
            value={fitnessData.oneRmSquat}
            onChange={handleFitnessChange("oneRmSquat")}
          />
          <TextField
            label="Bench"
            type="number"
            inputProps={{ min: 0, step: 0.5 }}
            fullWidth
            value={fitnessData.oneRmBench}
            onChange={handleFitnessChange("oneRmBench")}
          />
          <TextField
            label="Deadlift"
            type="number"
            inputProps={{ min: 0, step: 0.5 }}
            fullWidth
            value={fitnessData.oneRmDeadlift}
            onChange={handleFitnessChange("oneRmDeadlift")}
          />
        </Stack>
        <TextField
          label="Workouts per week"
          type="number"
          inputProps={{ min: 0, max: 14 }}
          fullWidth
          value={fitnessData.workoutsPerWeek}
          onChange={handleFitnessChange("workoutsPerWeek")}
        />
        <Box sx={classes.actions}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/profile")}
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
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile;
