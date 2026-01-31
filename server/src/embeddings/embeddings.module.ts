import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmbeddingsController } from './embeddings.controller';
import { EmbeddingsService } from './embeddings.service';
import { Embedding, EmbeddingSchema } from './schemas/embedding.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Embedding.name, schema: EmbeddingSchema },
        ]),
    ],
    controllers: [EmbeddingsController],
    providers: [EmbeddingsService],
    exports: [EmbeddingsService],
})
export class EmbeddingsModule { }
