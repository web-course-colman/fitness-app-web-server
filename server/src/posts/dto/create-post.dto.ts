import { User } from "src/auth/schemas/user.schema";

export class CreatePostDto {
    title: string;
    description?: string;
    pictures?: string[];
    workoutDetails?: {
        type?: string;
        duration?: number;
        calories?: number;
        subjectiveFeedbackFeelings?: string;
    };
    likes: User[];
    likesNumber: number;
}
