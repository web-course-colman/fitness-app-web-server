import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { Achievement, AchievementSchema } from './schemas/achievement.schema';
import { UserAchievement, UserAchievementSchema } from './schemas/user-achievement.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Achievement.name, schema: AchievementSchema },
            { name: UserAchievement.name, schema: UserAchievementSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [AchievementsController],
    providers: [AchievementsService],
    exports: [AchievementsService],
})
export class AchievementsModule { }
