import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AchievementsService } from './achievements.service';
import { OpenaiService } from '../openai/openai.service';
import { PostsService } from '../posts/posts.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Achievement, AchievementDocument } from './schemas/achievement.schema';
import { UserAchievement, UserAchievementDocument } from './schemas/user-achievement.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class AchievementTriggerService {
    private readonly logger = new Logger(AchievementTriggerService.name);

    constructor(
        private readonly achievementsService: AchievementsService,
        private readonly openaiService: OpenaiService,
        private readonly postsService: PostsService,
        @InjectModel(Achievement.name) private achievementModel: Model<AchievementDocument>,
        @InjectModel(UserAchievement.name) private userAchievementModel: Model<UserAchievementDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    @OnEvent('workout.summary.completed')
    async handleWorkoutCompleted(payload: { userId: string; summaryJson: any }) {
        this.logger.log(`Processing achievements for user: ${payload.userId}`);
        const { userId, summaryJson } = payload;

        // 1. Get all active achievements
        const achievements = await this.achievementModel.find({ isActive: true }).exec();

        for (const achievement of achievements) {
            await this.processAchievement(userId, achievement, summaryJson);
        }
    }

    private async processAchievement(userId: string, achievement: AchievementDocument, summaryJson: any) {
        // Find or create user achievement record
        let userAchievement = await this.userAchievementModel.findOne({
            userId: new Types.ObjectId(userId),
            achievementId: achievement._id,
        }).exec();

        if (!userAchievement) {
            userAchievement = new this.userAchievementModel({
                userId: new Types.ObjectId(userId),
                achievementId: achievement._id,
                currentTier: 'none',
                progressValue: 0,
                history: [],
            });
        }

        // Logic based on achievement type
        let progressIncrement = 0;
        if (achievement.type === 'cumulative') {
            progressIncrement = 1; // e.g., total workouts
        } else if (achievement.type === 'streak') {
            // Streaks are usually handled in User model, but we can sync here
            // For now, let's assume we'll use a simple increment for testing
            progressIncrement = 1;
        }

        userAchievement.progressValue += progressIncrement;

        // Check for tier upgrades
        await this.checkTierUpgrades(userAchievement, achievement);
        await userAchievement.save();
    }

    private async checkTierUpgrades(userAchievement: UserAchievementDocument, achievement: AchievementDocument) {
        const tiers = ['bronze', 'silver', 'gold', 'diamond'];
        const currentTierIndex = tiers.indexOf(userAchievement.currentTier);

        for (let i = currentTierIndex + 1; i < tiers.length; i++) {
            const nextTier = tiers[i];
            const tierConfig = achievement.tiers.find(t => t.level === nextTier);

            if (tierConfig && userAchievement.progressValue >= tierConfig.value) {
                userAchievement.currentTier = nextTier;
                userAchievement.unlockedAt = new Date();

                // Fetch user for personalized message
                const user = await this.userModel.findById(userAchievement.userId).exec();
                const userName = user?.name || 'Athlete';

                // Generate AI message asynchronously (don't block)
                const aiMessage = await this.openaiService.generateAchievementMessage(
                    userName,
                    achievement.name,
                    nextTier,
                    `Progress: ${userAchievement.progressValue} reaching threshold ${tierConfig.value}`
                );

                userAchievement.history.push({
                    tier: nextTier,
                    unlockedAt: new Date(),
                    aiMessage,
                });

                this.logger.log(`Achievement Unlocked! User: ${userAchievement.userId}, Achievement: ${achievement.name}, Tier: ${nextTier}`);

                // 2. Emit Notification Event
                this.achievementsService.emitUnlockEvent(
                    userAchievement.userId.toString(),
                    achievement.name,
                    nextTier,
                    aiMessage
                );

                // 3. Bonus: Award XP
                await this.achievementsService.addXp(userAchievement.userId.toString(), achievement.xpReward);
            } else {
                break; // Haven't reached this tier yet
            }
        }
    }
}
