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

export interface UserProfileSummary {
    userId: string;
    profileSummaryText: string;
    profileSummaryJson: Record<string, any>;
    version: number;
    updatedAt: string;
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
