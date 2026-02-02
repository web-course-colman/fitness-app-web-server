import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const OneRmSchema = z.object({
    squat: z.number().positive().optional(),
    bench: z.number().positive().optional(),
    deadlift: z.number().positive().optional(),
});

const CreateUserProfileSchema = z.object({
    userId: z.string().min(1),
    profileSummaryText: z.string().max(2500),
    profileSummaryJson: z.record(z.string(), z.any()),
    version: z.number(),
    height: z.number().positive().optional(),
    currentWeight: z.number().positive().optional(),
    age: z.number().int().min(1).max(120).optional(),
    sex: z.enum(['male', 'female', 'other']).optional(),
    bodyFatPercentage: z.number().min(0).max(100).optional(),
    vo2max: z.number().positive().optional(),
    oneRm: OneRmSchema.optional(),
    workoutsPerWeek: z.number().int().min(0).max(14).optional(),
});

export class CreateUserProfileDto extends createZodDto(CreateUserProfileSchema) { }
