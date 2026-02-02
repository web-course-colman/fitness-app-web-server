import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

@Schema({ _id: false })
export class OneRm {
    @Prop()
    squat?: number;

    @Prop()
    bench?: number;

    @Prop()
    deadlift?: number;
}

const OneRmSchema = SchemaFactory.createForClass(OneRm);

@Schema({ timestamps: true })
export class UserProfile {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: Types.ObjectId;

    @Prop({ required: true, maxlength: 2500 })
    profileSummaryText: string;

    @Prop({ type: Object, required: true })
    profileSummaryJson: Record<string, any>;

    @Prop({ required: true, default: 1 })
    version: number;

    @Prop()
    height?: number;

    @Prop()
    currentWeight?: number;

    @Prop()
    age?: number;

    @Prop({ enum: ['male', 'female', 'other'] })
    sex?: 'male' | 'female' | 'other';

    @Prop()
    bodyFatPercentage?: number;

    @Prop()
    vo2max?: number;

    @Prop({ type: OneRmSchema })
    oneRm?: OneRm;

    @Prop()
    workoutsPerWeek?: number;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
