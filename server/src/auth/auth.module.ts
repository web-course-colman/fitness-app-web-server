import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { User, UserSchema } from './schemas/user.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { AchievementsModule } from '../achievements/achievements.module';
import { UserProfilesModule } from '../user-profiles/user-profiles.module';

@Module({
    imports: [
        PassportModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        AchievementsModule,
        UserProfilesModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'default-secret',
                signOptions: {
                    expiresIn: (configService.get<string>('JWT_EXPIRATION') || '24h') as any,
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy],
    exports: [AuthService],
})
export class AuthModule { }
