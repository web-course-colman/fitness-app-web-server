import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../services/axios";
import { useAuth } from "../components/Auth/AuthProvider";

export interface CoachReference {
    id: string;
    text: string;
    date: string;
}

export interface CoachResponse {
    answer: string;
    suggestedNextSteps: string[];
    references: CoachReference[];
}

export interface OneRm {
    squat?: number;
    bench?: number;
    deadlift?: number;
}

export interface UserProfileSummary {
    userId: string;
    profileSummaryText: string;
    profileSummaryJson: Record<string, any>;
    version: number;
    updatedAt?: string;
    height?: number;
    currentWeight?: number;
    age?: number;
    sex?: 'male' | 'female' | 'other';
    bodyFatPercentage?: number;
    vo2max?: number;
    oneRm?: OneRm;
    workoutsPerWeek?: number;
}

/** Fetches user profile; returns null if profile does not exist (404). Use on Edit Profile to allow creating. */
export function useUserProfileForEdit() {
    const { loggedUser } = useAuth();

    return useQuery<UserProfileSummary | null>({
        queryKey: ['user-profile-edit', loggedUser?.userId],
        queryFn: async () => {
            if (!loggedUser?.userId) return null;
            try {
                const { data } = await api.get<UserProfileSummary>(`/api/user-profiles/${loggedUser.userId}`);
                return data;
            } catch (err: any) {
                if (err.response?.status === 404) return null;
                throw err;
            }
        },
        enabled: !!loggedUser?.userId,
    });
}

export function useAiCoach() {
    return useMutation({
        mutationFn: async (question: string) => {
            const { data } = await api.post<CoachResponse>("/api/coach/ask", { question });
            return data;
        },
    });
}

export function useUserProfileSummary() {
    const { loggedUser } = useAuth();

    return useQuery<UserProfileSummary>({
        queryKey: ["user-profile-summary", loggedUser?.userId],
        queryFn: async () => {
            if (!loggedUser?.userId) throw new Error("User not logged in");
            const { data } = await api.get<UserProfileSummary>(`/api/user-profiles/${loggedUser.userId}`);
            return data;
        },
        enabled: !!loggedUser?.userId,
    });
}
