import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import { useAuth, User } from "../components/Auth/AuthProvider";

export interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    lastName: string;
    username: string;
    picture?: string;
  };
  title: string;
  description?: string;
  workoutDetails?: {
    type?: string;
    duration?: number;
    calories?: number;
  };
  pictures?: string[];
  likes: { username: string; picture?: string }[];
  likeNumber: number;
  createdAt: string;
  updatedAt: string;
}

export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await api.get("/api/posts");
      return data;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Partial<Post>) => {
      const { data } = await api.post("/api/posts", post);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUserPosts() {
  const { loggedUser } = useAuth();

  return useQuery<Post[]>({
    queryKey: ["posts", "user", loggedUser?.userId],
    queryFn: async () => {
      if (!loggedUser?.userId) return [];
      const { data } = await api.get(`/api/posts/author/${loggedUser.userId}`);
      return data;
    },
    enabled: !!loggedUser?.userId,
  });
}

