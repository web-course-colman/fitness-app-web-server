import { Module, Global } from '@nestjs/common';
import { AiWorkerService } from './ai-worker.service';
import { WorkoutSummariesModule } from '../workout-summaries/workout-summaries.module';
import { UserProfilesModule } from '../user-profiles/user-profiles.module';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { PostsModule } from '../posts/posts.module';

@Module({
    imports: [
        WorkoutSummariesModule,
        UserProfilesModule,
        EmbeddingsModule,
        PostsModule,
    ],
    providers: [AiWorkerService],
    exports: [AiWorkerService],
})
export class AiWorkerModule { }
