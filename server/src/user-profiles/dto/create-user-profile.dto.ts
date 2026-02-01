import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateUserProfileSchema = z.object({
    userId: z.string().min(1),
    profileSummaryText: z.string().max(2500),
    profileSummaryJson: z.record(z.string(), z.any()),
    version: z.number(),
});

export class CreateUserProfileDto extends createZodDto(CreateUserProfileSchema) { }
