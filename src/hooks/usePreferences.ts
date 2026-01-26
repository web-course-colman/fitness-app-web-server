import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import { useAuth } from "../components/Auth/AuthProvider";
import { toast } from "./use-toast";

export interface Preferences {
    pushNotifications: boolean;
    darkMode: boolean;
    units: string;
    weeklyGoal: number;
}

export const usePreferences = () => {
    const queryClient = useQueryClient();
    const { loggedUser, refreshProfile } = useAuth();

    const mutation = useMutation({
        mutationFn: async (newPreferences: Partial<Preferences>) => {
            const { data } = await api.post("/api/auth/preferences", newPreferences);
            return data;
        },
        onSuccess: async () => {
            await refreshProfile();
            // We should probably trigger a refresh of the profile in AuthProvider
            // For now, let's just invalidate queries.
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: (error) => {
            console.error("Failed to update preferences", error);
            toast({
                title: "Error",
                description: "Failed to update preferences",
                variant: "destructive",
            });
        },
    });

    return {
        updatePreferences: mutation.mutate,
        isUpdating: mutation.isPending,
        preferences: loggedUser?.preferences,
    };
};
