import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkoutSummaryDocument = WorkoutSummary & Document;

@Schema({ timestamps: true })
export class WorkoutSummary {
    @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
    workoutId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: false })
    summaryText?: string;

    @Prop({ type: Object, required: false })
    summaryJson?: Record<string, any>;

    @Prop({
        required: true,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    })
    status: string;

    @Prop({ required: false })
    error?: string;
}

export const WorkoutSummarySchema = SchemaFactory.createForClass(WorkoutSummary);
