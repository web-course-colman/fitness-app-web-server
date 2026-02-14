import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Achievement, AchievementDocument } from './schemas/achievement.schema';
import { UserAchievement, UserAchievementDocument } from './schemas/user-achievement.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class AchievementsService {
    private readonly logger = new Logger(AchievementsService.name);

    constructor(
        @InjectModel(Achievement.name) private achievementModel: Model<AchievementDocument>,
        @InjectModel(UserAchievement.name) private userAchievementModel: Model<UserAchievementDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async findAll(): Promise<Achievement[]> {
        return this.achievementModel.find({ isActive: true }).exec();
    }

    async findUserAchievements(userId: string): Promise<UserAchievement[]> {
        return this.userAchievementModel
            .find({ userId: new Types.ObjectId(userId) })
            .populate('achievementId')
            .exec();
    }

    async getXpAndLevel(userId: string) {
        const user = await this.userModel.findById(userId, { totalXp: 1, level: 1 }).exec();
        if (!user) throw new NotFoundException('User not found');
        return {
            totalXp: user.totalXp || 0,
            level: user.level || 1,
            nextLevelXp: (user.level || 1) * 1000, // Simple leveling formula
        };
    }

    // This will be expanded in the "XP & Leveling Logic" step
    async addXp(userId: string, xp: number): Promise<void> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) return;

        const currentXp = (user.totalXp || 0) + xp;
        const currentLevel = Math.floor(currentXp / 1000) + 1;

        await this.userModel.findByIdAndUpdate(userId, {
            totalXp: currentXp,
            level: currentLevel,
        }).exec();

        this.logger.log(`User ${userId} earned ${xp} XP. Total XP: ${currentXp}, Level: ${currentLevel}`);
    }
}
