import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AchievementDocument = Achievement & Document;

@Schema({ _id: false })
export class AchievementTier {
    @Prop({ required: true, enum: ['bronze', 'silver', 'gold', 'diamond'] })
    level: string;

    @Prop({ required: true })
    value: number;
}

const AchievementTierSchema = SchemaFactory.createForClass(AchievementTier);

@Schema({ timestamps: true })
export class Achievement {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, enum: ['consistency', 'performance', 'behavior', 'ai'] })
    category: string;

    @Prop({ required: true, enum: ['streak', 'metric_threshold', 'cumulative', 'ai_pattern'] })
    type: string;

    @Prop({ type: [AchievementTierSchema], required: true })
    tiers: AchievementTier[];

    @Prop({ required: true })
    icon: string;

    @Prop({ required: true, default: 100 })
    xpReward: number;

    @Prop({ default: true })
    isActive: boolean;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
