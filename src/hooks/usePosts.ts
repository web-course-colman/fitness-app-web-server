import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import { useAuth, User } from "../components/Auth/AuthProvider";

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
  src?: string;
  workoutDetails?: {
    type?: string;
    duration?: number;
    calories?: number;
    subjectiveFeedbackFeelings?: string;
    personalGoals?: string;
  };
  pictures?: string[];
  likes?: { username: string; picture?: string }[];
  likeNumber: number;
  commentsNumber?: number;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function usePosts(authorId?: string, options?: { enabled?: boolean }) {
  return useQuery<Post[]>({
    queryKey: authorId ? ["posts", "author", authorId] : ["posts"],
    queryFn: async () => {
      const url = authorId ? `/api/posts/author/${authorId}` : "/api/posts";
      const { data } = await api.get(url);
      return data;
    },
    enabled: options?.enabled ?? true,
  });
}

export function usePost(postId: string) {
  return useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await api.get(`/api/posts/${postId}`);
      return data;
    },
    enabled: !!postId,
  });
}

/**
 * Paginated version of GET /posts ("get all posts").
 * Server is backwards compatible and returns the full list when pagination params are omitted.
 */
export function useAllPostsPaginated(params: { page: number; limit?: number; enabled?: boolean }) {
  const limit = params.limit ?? 10;

  return useQuery<PaginationResult<Post>>({
    queryKey: ["posts", "all", "paginated", params.page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/api/posts`, {
        params: {
          page: params.page,
          limit,
        },
      });
      return data;
    },
    // keep previous page data while fetching next page
    placeholderData: (previous) => previous,
    enabled: params.enabled ?? true,
  });
}

/**
 * Infinite scroll version of GET /posts ("get all posts").
 */
export function useAllPostsInfinite(params?: { limit?: number; enabled?: boolean }) {
  const limit = params?.limit ?? 3;

  return useInfiniteQuery<PaginationResult<Post>>({
    queryKey: ["posts", "all", "infinite", limit],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get(`/api/posts`, {
        params: {
          page: pageParam,
          limit,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.totalPages) return undefined;
      return lastPage.page + 1;
    },
    enabled: params?.enabled ?? true,
  });
}

/**
 * Infinite scroll for a single author's posts (GET /posts/author/:userId).
 */
export function useAuthorPostsInfinite(authorId?: string, params?: { limit?: number; enabled?: boolean }) {
  const limit = params?.limit ?? 3;

  return useInfiniteQuery<PaginationResult<Post>>({
    queryKey: ["posts", "author", authorId, "infinite", limit],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      if (!authorId) {
        return { items: [], total: 0, page: 1, limit, totalPages: 1 };
      }

      const { data } = await api.get(`/api/posts/author/${authorId}`, {
        params: {
          page: pageParam,
          limit,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.totalPages) return undefined;
      return lastPage.page + 1;
    },
    enabled: (params?.enabled ?? true) && !!authorId,
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

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await api.put('/api/posts/like', { _id: postId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, formData }: { postId: string; formData: FormData }) => {
      const { data } = await api.put(`/api/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId }: { postId: string; commentId: string }) => {
      const { data } = await api.delete(`/api/posts/${postId}/comments/${commentId}`);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId, content }: { postId: string; commentId: string; content: string }) => {
      const { data } = await api.put(`/api/posts/${postId}/comments/${commentId}`, { content });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await api.delete(`/api/posts/${postId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

