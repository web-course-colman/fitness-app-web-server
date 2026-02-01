import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateEmbeddingSchema = z.object({
    userId: z.string().min(1),
    refType: z.enum(['workout_summary', 'workout']),
    refId: z.string().min(1),
    vector: z.array(z.number()),
    text: z.string().min(1),
});

export class CreateEmbeddingDto extends createZodDto(CreateEmbeddingSchema) { }
