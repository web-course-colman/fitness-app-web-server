import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateWorkoutSummarySchema = z.object({
    workoutId: z.string().min(1),
    userId: z.string().min(1),
    summaryText: z.string().optional(),
    summaryJson: z.record(z.string(), z.any()).optional(),
    subjectiveFeedbackFeelings: z.string().optional(),
    personalGoals: z.string().optional(),
});

export class CreateWorkoutSummaryDto extends createZodDto(CreateWorkoutSummarySchema) { }
