import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutSummariesController } from './workout-summaries.controller';
import { WorkoutSummariesService } from './workout-summaries.service';
import { WorkoutSummary, WorkoutSummarySchema } from './schemas/workout-summary.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: WorkoutSummary.name, schema: WorkoutSummarySchema },
        ]),
    ],
    controllers: [WorkoutSummariesController],
    providers: [WorkoutSummariesService],
    exports: [WorkoutSummariesService],
})
export class WorkoutSummariesModule { }
