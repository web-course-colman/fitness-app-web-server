import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProfilesController } from './user-profiles.controller';
import { UserProfilesService } from './user-profiles.service';
import { UserProfile, UserProfileSchema } from './schemas/user-profile.schema';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UserProfile.name, schema: UserProfileSchema },
        ]),
        AchievementsModule,
    ],
    controllers: [UserProfilesController],
    providers: [UserProfilesService],
    exports: [UserProfilesService],
})
export class UserProfilesModule { }
