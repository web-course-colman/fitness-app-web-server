import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AskCoachSchema = z.object({
    question: z.string().min(1, 'Question cannot be empty'),
});

export class AskCoachDto extends createZodDto(AskCoachSchema) { }
