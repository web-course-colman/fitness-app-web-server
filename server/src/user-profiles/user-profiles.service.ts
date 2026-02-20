import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserProfile, UserProfileDocument } from './schemas/user-profile.schema';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class UserProfilesService {
    constructor(
        @InjectModel(UserProfile.name)
        private userProfileModel: Model<UserProfileDocument>,
        private readonly achievementsService: AchievementsService,
    ) { }

    async upsert(createDto: CreateUserProfileDto): Promise<UserProfile> {
        const { userId, ...rest } = createDto;
        const userObjectId = new Types.ObjectId(userId);

        return this.userProfileModel.findOneAndUpdate(
            { userId: userObjectId },
            { ...rest, userId: userObjectId },
            { new: true, upsert: true },
        ).exec();
    }

    async findByUser(userId: string): Promise<any> {
        const profile = await this.userProfileModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
        if (!profile) {
            throw new NotFoundException(`User profile for user ${userId} not found`);
        }

        const achievements = await this.achievementsService.findUserAchievements(userId);
        const xpStats = await this.achievementsService.getXpAndLevel(userId);

        return {
            ...profile.toObject(),
            achievements,
            xpStats,
        };
    }
}
