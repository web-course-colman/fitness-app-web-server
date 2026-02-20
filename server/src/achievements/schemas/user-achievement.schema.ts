import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserAchievementDocument = UserAchievement & Document;

@Schema({ _id: false })
export class AchievementHistory {
    @Prop({ required: true, enum: ['bronze', 'silver', 'gold', 'diamond'] })
    tier: string;

    @Prop({ default: Date.now })
    unlockedAt: Date;

    @Prop({ required: false })
    aiMessage?: string;
}

const AchievementHistorySchema = SchemaFactory.createForClass(AchievementHistory);

@Schema({ timestamps: true })
export class UserAchievement {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Achievement', required: true })
    achievementId: Types.ObjectId;

    @Prop({ required: true, enum: ['none', 'bronze', 'silver', 'gold', 'diamond'], default: 'none' })
    currentTier: string;

    @Prop({ required: true, default: 0 })
    progressValue: number;

    @Prop()
    unlockedAt?: Date;

    @Prop({ type: [AchievementHistorySchema], default: [] })
    history: AchievementHistory[];
}

export const UserAchievementSchema = SchemaFactory.createForClass(UserAchievement);
