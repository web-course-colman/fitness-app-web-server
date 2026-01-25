import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  workout_type: string | null;
  duration_minutes: number | null;
  calories_burned: number | null;
  image_url: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      // Get posts first
      // TODO: Implement actual API call
      
      // Get profiles for each unique user_id
      return [];
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
//   const { user } = useAuth();

  return useMutation({
    mutationFn: async (post: {
      title: string;
      content?: string;
      workout_type?: string;
      duration_minutes?: number;
      calories_burned?: number;
    }) => {
    //   if (!user) throw new Error("Not authenticated");
      
    //  insert new post
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUserPosts() {
//   const { user } = useAuth();

  return useQuery({
    queryKey: ["posts", "user", /*user?.id*/],
    queryFn: async () => {
    //   if (!user) return [];
      
      // get all user posts

    },
    // enabled: !!user,
  });
}
