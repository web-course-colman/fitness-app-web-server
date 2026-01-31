import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmbeddingDocument = Embedding & Document;

@Schema({ timestamps: true })
export class Embedding {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true, enum: ['workout_summary', 'workout'] })
    refType: string;

    @Prop({ type: Types.ObjectId, required: true })
    refId: Types.ObjectId;

    @Prop({ type: [Number], required: true })
    vector: number[];

    @Prop({ required: true })
    text: string;
}

export const EmbeddingSchema = SchemaFactory.createForClass(Embedding);
