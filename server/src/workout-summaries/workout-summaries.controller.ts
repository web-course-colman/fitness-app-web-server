import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WorkoutSummariesService } from './workout-summaries.service';
import { CreateWorkoutSummaryDto } from './dto/create-workout-summary.dto';

@Controller('workout-summaries')
export class WorkoutSummariesController {
    constructor(private readonly workoutSummariesService: WorkoutSummariesService) { }

    @Post()
    create(@Body() createDto: CreateWorkoutSummaryDto) {
        return this.workoutSummariesService.create(createDto);
    }

    @Get()
    findAll() {
        return this.workoutSummariesService.findAll();
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.workoutSummariesService.findByUser(userId);
    }

    @Get('workout/:workoutId')
    findByWorkout(@Param('workoutId') workoutId: string) {
        return this.workoutSummariesService.findByWorkout(workoutId);
    }
}
