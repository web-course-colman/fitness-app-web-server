export class CreatePostDto {
    title: string;
    description?: string;
    pictures?: string[];
    workoutDetails?: {
        type?: string;
        duration?: number;
        calories?: number;
    };
}
