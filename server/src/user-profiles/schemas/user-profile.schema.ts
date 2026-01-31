import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

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
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
