import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { CreateEmbeddingDto } from './dto/create-embedding.dto';

@Controller('embeddings')
export class EmbeddingsController {
    constructor(private readonly embeddingsService: EmbeddingsService) { }

    @Post()
    create(@Body() createDto: CreateEmbeddingDto) {
        return this.embeddingsService.create(createDto);
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.embeddingsService.findByUser(userId);
    }

    @Get('reference')
    findByReference(
        @Query('refType') refType: string,
        @Query('refId') refId: string,
    ) {
        return this.embeddingsService.findByReference(refType, refId);
    }
}
