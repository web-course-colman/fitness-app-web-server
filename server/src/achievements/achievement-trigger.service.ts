import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AchievementsService } from './achievements.service';
import { OpenaiService } from '../openai/openai.service';
import { PostsService } from '../posts/posts.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Achievement, AchievementDocument } from './schemas/achievement.schema';
import {
  UserAchievement,
  UserAchievementDocument,
} from './schemas/user-achievement.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class AchievementTriggerService {
  private readonly logger = new Logger(AchievementTriggerService.name);
  private static readonly PAIN_KEYWORDS = [
    'pain',
    'hurt',
    'injury',
    'injured',
    'ache',
    'aching',
    'sore',
    'soreness',
    'strain',
    'sprain',
  ];

  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly openaiService: OpenaiService,
    private readonly postsService: PostsService,
    @InjectModel(Achievement.name)
    private achievementModel: Model<AchievementDocument>,
    @InjectModel(UserAchievement.name)
    private userAchievementModel: Model<UserAchievementDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @OnEvent('workout.created')
  async handleWorkoutCreated(payload: { userId: string; postId?: string }) {
    this.logger.log(
      `Processing achievements after shared post for user: ${payload.userId}`,
    );
    await this.recomputePostBasedAchievements(payload.userId);
  }

  @OnEvent('workout.deleted')
  async handleWorkoutDeleted(payload: { userId: string }) {
    this.logger.log(
      `Recalculating achievements after workout deletion for user: ${payload.userId}`,
    );
    await this.recomputePostBasedAchievements(payload.userId);
  }

  @OnEvent('coach.interaction')
  async handleCoachInteraction(payload: { userId: string; source?: string }) {
    const isTipRequestSource =
      payload.source === 'ask' || payload.source === 'ask_stream';
    if (!isTipRequestSource) {
      return;
    }

    const user = await this.userModel
      .findByIdAndUpdate(
        payload.userId,
        { $inc: { aiUsage: 1 } },
        { new: true },
      )
      .exec();
    if (!user) return;

    const achievement = await this.achievementModel
      .findOne({ name: 'AI Focused', isActive: true })
      .exec();
    if (!achievement) return;

    await this.processAchievement(payload.userId, achievement, user, null);
  }

  private async processAchievement(
    userId: string,
    achievement: AchievementDocument,
    user: UserDocument,
    posts: any[] | null,
  ) {
    let userAchievement = await this.userAchievementModel
      .findOne({
        userId: new Types.ObjectId(userId),
        achievementId: achievement._id,
      })
      .exec();

    if (!userAchievement) {
      userAchievement = new this.userAchievementModel({
        userId: new Types.ObjectId(userId),
        achievementId: achievement._id,
        currentTier: 'none',
        progressValue: 0,
        history: [],
      });
    }

    const computedProgress = this.computeProgressByRule(
      achievement.name,
      user,
      posts || [],
    );
    userAchievement.progressValue = computedProgress;

    await this.checkTierUpgrades(userAchievement, achievement);
    await userAchievement.save();
  }

  private async recomputePostBasedAchievements(userId: string): Promise<void> {
    const achievements = await this.achievementModel
      .find({ isActive: true })
      .exec();
    const [user, posts] = await Promise.all([
      this.userModel.findById(userId).exec(),
      this.postsService.findByAuthor(userId),
    ]);

    if (!user) return;

    for (const achievement of achievements) {
      if (achievement.name === 'AI Focused') {
        continue;
      }
      await this.processAchievement(userId, achievement, user, posts);
    }
  }

  private computeProgressByRule(
    achievementName: string,
    user: UserDocument,
    posts: any[],
  ): number {
    switch (achievementName) {
      case 'First Steps':
        return posts.filter((post) => this.isActivityPost(post)).length;
      case 'Volume King':
        return this.calculateTotalDuration(posts);
      case 'Workout Streak':
        return user.streak || 0;
      case 'Pain Free':
        return posts.filter((post) => this.isPainFree(post)).length;
      case 'Early Bird':
        return posts.filter((post) => this.isEarlyBird(post?.createdAt)).length;
      case 'Consistency Master':
        return this.calculateConsecutiveQualifiedWeeks(posts, 4);
      case 'AI Focused':
        return user.aiUsage || 0;
      default:
        return posts.length;
    }
  }

  private isPainFree(post: any): boolean {
    const text = [
      post?.workoutDetails?.subjectiveFeedbackFeelings,
      post?.description,
      post?.title,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return !AchievementTriggerService.PAIN_KEYWORDS.some((keyword) =>
      text.includes(keyword),
    );
  }

  private isActivityPost(post: any): boolean {
    const activity = post?.workoutDetails;
    if (!activity) return false;

    return Boolean(
      activity?.type ||
      activity?.duration ||
      activity?.calories ||
      activity?.subjectiveFeedbackFeelings ||
      activity?.personalGoals,
    );
  }

  private calculateTotalDuration(posts: any[]): number {
    return posts.reduce((total, post) => {
      const rawDuration = post?.workoutDetails?.duration;
      const duration =
        typeof rawDuration === 'number' ? rawDuration : Number(rawDuration);

      if (!Number.isFinite(duration) || duration <= 0) {
        return total;
      }

      return total + duration;
    }, 0);
  }

  private isEarlyBird(createdAt?: Date): boolean {
    if (!createdAt) return false;
    const date = new Date(createdAt);
    return date.getHours() < 8 && date.getHours() >= 5;
  }

  private calculateConsecutiveQualifiedWeeks(
    posts: any[],
    requiredPerWeek: number,
  ): number {
    const weeklyCount = new Map<string, { date: Date; count: number }>();

    for (const post of posts) {
      if (!post?.createdAt) continue;
      const weekStart = this.getWeekStartUtc(new Date(post.createdAt));
      const key = weekStart.toISOString();
      const existing = weeklyCount.get(key);
      if (!existing) {
        weeklyCount.set(key, { date: weekStart, count: 1 });
      } else {
        existing.count += 1;
      }
    }

    const qualifiedWeeks = Array.from(weeklyCount.values())
      .filter((week) => week.count >= requiredPerWeek)
      .map((week) => week.date)
      .sort((a, b) => b.getTime() - a.getTime());

    if (qualifiedWeeks.length === 0) return 0;

    let streak = 1;
    let previous = qualifiedWeeks[0];

    for (let i = 1; i < qualifiedWeeks.length; i++) {
      const current = qualifiedWeeks[i];
      const expected = new Date(previous);
      expected.setUTCDate(expected.getUTCDate() - 7);

      if (current.getTime() === expected.getTime()) {
        streak += 1;
        previous = current;
      } else {
        break;
      }
    }

    return streak;
  }

  private getWeekStartUtc(date: Date): Date {
    const d = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() - day + 1);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  private async checkTierUpgrades(
    userAchievement: UserAchievementDocument,
    achievement: AchievementDocument,
  ) {
    const tiers = ['bronze', 'silver', 'gold', 'diamond'];
    const currentTierIndex = tiers.indexOf(userAchievement.currentTier);

    for (let i = currentTierIndex + 1; i < tiers.length; i++) {
      const nextTier = tiers[i];
      const tierConfig = achievement.tiers.find((t) => t.level === nextTier);

      if (tierConfig && userAchievement.progressValue >= tierConfig.value) {
        userAchievement.currentTier = nextTier;
        userAchievement.unlockedAt = new Date();

        // Fetch user for personalized message
        const user = await this.userModel
          .findById(userAchievement.userId)
          .exec();
        const userName = user?.name || 'Athlete';

        // Generate AI message asynchronously (don't block)
        const aiMessage = await this.openaiService.generateAchievementMessage(
          userName,
          achievement.name,
          nextTier,
          `Progress: ${userAchievement.progressValue} reaching threshold ${tierConfig.value}`,
        );

        userAchievement.history.push({
          tier: nextTier,
          unlockedAt: new Date(),
          aiMessage,
        });

        this.logger.log(
          `Achievement Unlocked! User: ${userAchievement.userId}, Achievement: ${achievement.name}, Tier: ${nextTier}`,
        );

        // 2. Emit Notification Event
        this.achievementsService.emitUnlockEvent(
          userAchievement.userId.toString(),
          achievement.name,
          nextTier,
          aiMessage,
        );

        // 3. Bonus: Award XP
        await this.achievementsService.addXp(
          userAchievement.userId.toString(),
          achievement.xpReward,
        );
      } else {
        break; // Haven't reached this tier yet
      }
    }
  }
}
