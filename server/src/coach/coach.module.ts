import { Module } from '@nestjs/common';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { WorkoutSummariesModule } from '../workout-summaries/workout-summaries.module';
import { UserProfilesModule } from '../user-profiles/user-profiles.module';
import { OpenaiModule } from '../openai/openai.module';

@Module({
    imports: [
        EmbeddingsModule,
        WorkoutSummariesModule,
        UserProfilesModule,
        OpenaiModule,
    ],
    controllers: [CoachController],
    providers: [CoachService],
})
export class CoachModule { }
