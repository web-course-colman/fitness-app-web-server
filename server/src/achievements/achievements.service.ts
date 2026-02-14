import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
        private eventEmitter: EventEmitter2,
    ) { }

    emitUnlockEvent(userId: string, achievementName: string, tier: string, aiMessage?: string) {
        this.eventEmitter.emit('achievement.unlocked', {
            userId,
            achievementName,
            tier,
            aiMessage,
        });
    }

    async findAll(): Promise<Achievement[]> {
        return this.achievementModel.find({ isActive: true }).exec();
    }

    async findUserAchievements(userId: string): Promise<any[]> {
        const allAchievements = await this.achievementModel.find({ isActive: true }).exec();
        const userAchievements = await this.userAchievementModel
            .find({ userId: new Types.ObjectId(userId) })
            .exec();

        return allAchievements.map(achievement => {
            const userProgress = userAchievements.find(
                ua => ua.achievementId.toString() === achievement._id.toString()
            );

            return {
                achievementId: achievement._id,
                achievement: achievement.toObject(),
                currentTier: userProgress ? userProgress.currentTier : 'none',
                progressValue: userProgress ? userProgress.progressValue : 0,
                unlockedAt: userProgress ? userProgress.unlockedAt : null,
                history: userProgress ? userProgress.history : [],
            };
        });
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

        this.eventEmitter.emit('xp.earned', {
            userId,
            xp,
            totalXp: currentXp,
            level: currentLevel,
        });

        this.logger.log(`User ${userId} earned ${xp} XP. Total XP: ${currentXp}, Level: ${currentLevel}`);
    }
}
