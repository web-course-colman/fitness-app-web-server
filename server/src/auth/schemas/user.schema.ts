import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: false })
    picture?: string;

    @Prop({ required: false })
    email?: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ required: false })
    refreshToken?: string;

    @Prop({
        type: {
            pushNotifications: { type: Boolean, default: true },
            darkMode: { type: Boolean, default: false },
            units: { type: String, default: 'metric' },
            weeklyGoal: { type: Number, default: 3 },
        },
        default: {
            pushNotifications: true,
            darkMode: false,
            units: 'metric',
            weeklyGoal: 3,
        },
    })
    preferences: {
        pushNotifications: boolean;
        darkMode: boolean;
        units: string;
        weeklyGoal: number;
    };
}

export const UserSchema = SchemaFactory.createForClass(User);
