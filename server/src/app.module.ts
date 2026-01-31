import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { WorkoutSummariesModule } from './workout-summaries/workout-summaries.module';
import { UserProfilesModule } from './user-profiles/user-profiles.module';
import { EmbeddingsModule } from './embeddings/embeddings.module';
import { AiWorkerModule } from './ai-worker/ai-worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/fitness-app',
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'dist'),
    }),
    AuthModule,
    PostsModule,
    WorkoutSummariesModule,
    UserProfilesModule,
    EmbeddingsModule,
    AiWorkerModule,
  ],
})
export class AppModule { }

