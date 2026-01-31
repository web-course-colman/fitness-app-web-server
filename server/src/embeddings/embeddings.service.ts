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

    async findByUser(userId: string): Promise<Embedding[]> {
        return this.embeddingModel.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    async findByReference(refType: string, refId: string): Promise<Embedding[]> {
        return this.embeddingModel.find({
            refType,
            refId: new Types.ObjectId(refId)
        }).exec();
    }
}
