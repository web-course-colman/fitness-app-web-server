import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Embedding, EmbeddingDocument } from './schemas/embedding.schema';
import { CreateEmbeddingDto } from './dto/create-embedding.dto';

@Injectable()
export class EmbeddingsService {
    constructor(
        @InjectModel(Embedding.name)
        private embeddingModel: Model<EmbeddingDocument>,
    ) { }

    async create(createDto: CreateEmbeddingDto): Promise<Embedding> {
        const createdEmbedding = new this.embeddingModel({
            ...createDto,
            userId: new Types.ObjectId(createDto.userId),
            refId: new Types.ObjectId(createDto.refId),
        });
        return createdEmbedding.save();
    }

    async update(refType: string, refId: string, vector: number[], text: string): Promise<Embedding | null> {
        return this.embeddingModel.findOneAndUpdate(
            { refType, refId: new Types.ObjectId(refId) },
            { vector, text },
            { new: true }
        ).exec();
    }

    async findByUser(userId: string): Promise<Embedding[]> {
        return this.embeddingModel.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    async findByReference(refType: string, refId: string): Promise<Embedding[]> {
        return this.embeddingModel.find({
            refType,
            refId: new Types.ObjectId(refId)
        }).exec();
    }

    async findSimilar(vector: number[], userId: string, limit: number = 5): Promise<Embedding[]> {
        const userEmbeddings = await this.embeddingModel.find({ userId: new Types.ObjectId(userId) }).exec();

        // Simple dot product similarity calculation (Mock RAG logic)
        const scored = userEmbeddings.map(emb => {
            const score = emb.vector.reduce((sum, val, i) => sum + (val * (vector[i] || 0)), 0);
            return { emb, score };
        });

        return scored
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(s => s.emb);
    }

    async deleteByReference(refType: string, refId: string): Promise<any> {
        return this.embeddingModel.deleteMany({
            refType,
            refId: new Types.ObjectId(refId)
        }).exec();
    }
}
