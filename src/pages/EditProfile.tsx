import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema, EditProfileFormValues, EditProfileFormOutput } from "./EditProfile.schema";
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

const EditProfile = () => {
  const classes = useStyles();
  const { loggedUser, refreshProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userProfile } = useUserProfileForEdit();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormValues, any, EditProfileFormOutput>({
    resolver: zodResolver(editProfileSchema) as Resolver<EditProfileFormValues> as any,
    defaultValues: {
      username: "",
      email: "",
      picture: "",
      description: "",
      sportType: "Athlete",
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
    },
  });

  // Watch picture field for preview fallback
  const pictureUrl = watch("picture");

  useEffect(() => {
    if (loggedUser) {
      reset((formValues) => ({
        ...formValues,
        username: loggedUser.username || "",
        email: loggedUser.email || "",
        picture: loggedUser.picture || "",
        description: loggedUser.description || "",
        sportType: loggedUser.sportType || "Athlete",
      }));
    }
  }, [loggedUser, reset]);

  useEffect(() => {
    if (userProfile !== undefined && userProfile !== null) {
      reset((formValues) => ({
        ...formValues,
        height: userProfile.height != null ? String(userProfile.height) : "",
        currentWeight: userProfile.currentWeight != null ? String(userProfile.currentWeight) : "",
        age: userProfile.age != null ? String(userProfile.age) : "",
        sex: userProfile.sex || "",
        bodyFatPercentage: userProfile.bodyFatPercentage != null ? String(userProfile.bodyFatPercentage) : "",
        vo2max: userProfile.vo2max != null ? String(userProfile.vo2max) : "",
        oneRmSquat: userProfile.oneRm?.squat != null ? String(userProfile.oneRm.squat) : "",
        oneRmBench: userProfile.oneRm?.bench != null ? String(userProfile.oneRm.bench) : "",
        oneRmDeadlift: userProfile.oneRm?.deadlift != null ? String(userProfile.oneRm.deadlift) : "",
        workoutsPerWeek: userProfile.workoutsPerWeek != null ? String(userProfile.workoutsPerWeek) : "",
      }));
    }
  }, [userProfile, reset]);

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

  const onSubmit = async (data: EditProfileFormOutput) => {
    try {
      setIsLoading(true);

      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append("username", data.username);
      formDataToSend.append("email", data.email);
      formDataToSend.append("description", data.description || "");
      formDataToSend.append("sportType", data.sportType || "");

      // Only append picture URL if no file is selected
      if (!selectedFile && data.picture) {
        formDataToSend.append("picture", data.picture);
      }

      // Append file if selected
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      await api.post("/api/auth/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Upsert user-profiles (fitness & stats)
      if (loggedUser?.userId) {
        // Determine if any 1RM values are set
        const hasOneRm =
          data.oneRmSquat != null ||
          data.oneRmBench != null ||
          data.oneRmDeadlift != null;

        const oneRm = hasOneRm ? {
          ...(data.oneRmSquat != null && { squat: Number(data.oneRmSquat) }),
          ...(data.oneRmBench != null && { bench: Number(data.oneRmBench) }),
          ...(data.oneRmDeadlift != null && { deadlift: Number(data.oneRmDeadlift) }),
        } : undefined;

        await api.post("/api/user-profiles", {
          userId: loggedUser.userId,
          profileSummaryText: userProfile?.profileSummaryText ?? "",
          profileSummaryJson: userProfile?.profileSummaryJson ?? {},
          version: userProfile?.version ?? 1,
          ...(data.height != null && { height: Number(data.height) }),
          ...(data.currentWeight != null && { currentWeight: Number(data.currentWeight) }),
          ...(data.age != null && { age: Number(data.age) }),
          ...(data.sex && { sex: data.sex as "male" | "female" | "other" }),
          ...(data.bodyFatPercentage != null && { bodyFatPercentage: Number(data.bodyFatPercentage) }),
          ...(data.vo2max != null && { vo2max: Number(data.vo2max) }),
          ...(oneRm && { oneRm }),
          ...(data.workoutsPerWeek != null && { workoutsPerWeek: Number(data.workoutsPerWeek) }),
        });

        queryClient.invalidateQueries({
          queryKey: ["user-profile-edit", loggedUser.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["user-profile-summary", loggedUser.userId],
        });
      }

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
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={classes.form}>
        <Box sx={classes.contentRow}>
          <Box sx={classes.leftColumn}>
            <Avatar
              src={previewUrl || pictureUrl || loggedUser?.picture}
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
              fullWidth
              {...register("username")}
              required
              helperText={errors.username?.message}
              error={!!errors.username}
            />

            <TextField
              label="Email"
              fullWidth
              {...register("email")}
              required
              type="email"
              helperText={errors.email?.message}
              error={!!errors.email}
            />

            <TextField
              label="Bio / Description"
              fullWidth
              multiline
              rows={3}
              {...register("description")}
              placeholder="Tell us about yourself..."
              helperText="Share your fitness journey, goals, or interests"
            />

            <FormControl fullWidth>
              <InputLabel id="sport-type-label">Sport Type</InputLabel>
              <Controller
                name="sportType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="sport-type-label"
                    label="Sport Type"
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
                )}
              />
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
            {...register("height")}
            error={!!errors.height}
            helperText={errors.height?.message}
          />
          <TextField
            label="Current weight (kg)"
            type="number"
            inputProps={{ min: 20, max: 500, step: 0.1 }}
            fullWidth
            {...register("currentWeight")}
            error={!!errors.currentWeight}
            helperText={errors.currentWeight?.message}
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Age"
            type="number"
            inputProps={{ min: 1, max: 120 }}
            fullWidth
            {...register("age")}
            error={!!errors.age}
            helperText={errors.age?.message}
          />
          <FormControl fullWidth>
            <InputLabel id="sex-label">Sex</InputLabel>
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <Select {...field} labelId="sex-label" label="Sex">
                  <MenuItem value="">—</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Body fat (%)"
            type="number"
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            fullWidth
            {...register("bodyFatPercentage")}
            error={!!errors.bodyFatPercentage}
            helperText={errors.bodyFatPercentage?.message}
          />
          <TextField
            label="VO₂max (ml/kg/min)"
            type="number"
            inputProps={{ min: 10, max: 100, step: 0.1 }}
            fullWidth
            {...register("vo2max")}
            error={!!errors.vo2max}
            helperText={errors.vo2max?.message}
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
            {...register("oneRmSquat")}
          />
          <TextField
            label="Bench"
            type="number"
            inputProps={{ min: 0, step: 0.5 }}
            fullWidth
            {...register("oneRmBench")}
          />
          <TextField
            label="Deadlift"
            type="number"
            inputProps={{ min: 0, step: 0.5 }}
            fullWidth
            {...register("oneRmDeadlift")}
          />
        </Stack>
        <TextField
          label="Workouts per week"
          type="number"
          inputProps={{ min: 0, max: 14 }}
          fullWidth
          {...register("workoutsPerWeek")}
          error={!!errors.workoutsPerWeek}
          helperText={errors.workoutsPerWeek?.message}
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
