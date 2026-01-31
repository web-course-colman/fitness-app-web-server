import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ _id: false })
class WorkoutDetails {
    @Prop({ required: false })
    type?: string;

    @Prop({ required: false })
    duration?: number;

    @Prop({ required: false })
    calories?: number;
}

const WorkoutDetailsSchema = SchemaFactory.createForClass(WorkoutDetails);

class Like {
    @Prop({ required: true })
    username: string;

    @Prop({ required: false })
    picture?: string;
}

const LikeSchema = SchemaFactory.createForClass(Like);

@Schema({ timestamps: true })
export class Post {
    @Prop({ required: true })
    title: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ type: [String], required: false })
    pictures?: string[];

    @Prop({ type: [LikeSchema], required: false, default: [] })
    likes: Like[];

    @Prop({ type: Number, required: false, default: 0 })
    likeNumber: number;

    @Prop({ type: WorkoutDetailsSchema, required: false })
    workoutDetails?: WorkoutDetails;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
