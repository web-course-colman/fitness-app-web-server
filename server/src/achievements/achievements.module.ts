import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AchievementsService } from './achievements.service';
import { AchievementTriggerService } from './achievement-trigger.service';
import { AchievementsController } from './achievements.controller';
import { Achievement, AchievementSchema } from './schemas/achievement.schema';
import { UserAchievement, UserAchievementSchema } from './schemas/user-achievement.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { OpenaiModule } from '../openai/openai.module';
import { PostsModule } from '../posts/posts.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Achievement.name, schema: AchievementSchema },
            { name: UserAchievement.name, schema: UserAchievementSchema },
            { name: User.name, schema: UserSchema },
        ]),
        OpenaiModule,
        PostsModule,
    ],
    controllers: [AchievementsController],
    providers: [AchievementsService, AchievementTriggerService],
    exports: [AchievementsService],
})
export class AchievementsModule { }
