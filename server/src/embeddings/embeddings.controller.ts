import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { CreateEmbeddingDto } from './dto/create-embedding.dto';
import { z } from 'zod';

const UserIdSchema = z.string().min(1);
const ReferenceQuerySchema = z.object({
    refType: z.enum(['workout_summary', 'workout']),
    refId: z.string().min(1),
});

@Controller('embeddings')
export class EmbeddingsController {
    constructor(private readonly embeddingsService: EmbeddingsService) { }

    @Post()
    create(@Body() createDto: CreateEmbeddingDto) {
        return this.embeddingsService.create(createDto);
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        UserIdSchema.parse(userId);
        return this.embeddingsService.findByUser(userId);
    }

    @Get('reference')
    findByReference(
        @Query('refType') refType: string,
        @Query('refId') refId: string,
    ) {
        ReferenceQuerySchema.parse({ refType, refId });
        return this.embeddingsService.findByReference(refType, refId);
    }
}
