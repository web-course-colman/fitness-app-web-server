import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import { useAuth } from "../components/Auth/AuthProvider";

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    lastName: string;
    username: string;
    picture?: string;
  };
  createdAt: string;
}

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
  comments?: Comment[];
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

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const { data } = await api.post(`/api/posts/${postId}/comments`, { content });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
    },
  });
}

