import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkoutSummary, WorkoutSummaryDocument } from './schemas/workout-summary.schema';
import { CreateWorkoutSummaryDto } from './dto/create-workout-summary.dto';

@Injectable()
export class WorkoutSummariesService {
    constructor(
        @InjectModel(WorkoutSummary.name)
        private workoutSummaryModel: Model<WorkoutSummaryDocument>,
    ) { }

    async create(createDto: CreateWorkoutSummaryDto): Promise<WorkoutSummary> {
        const createdSummary = new this.workoutSummaryModel({
            ...createDto,
            workoutId: new Types.ObjectId(createDto.workoutId),
            userId: new Types.ObjectId(createDto.userId),
        });
        return createdSummary.save();
    }

    async findAll(): Promise<WorkoutSummary[]> {
        return this.workoutSummaryModel.find().exec();
    }

    async findByUser(userId: string): Promise<WorkoutSummary[]> {
        return this.workoutSummaryModel.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    async findByWorkout(workoutId: string): Promise<WorkoutSummary> {
        const summary = await this.workoutSummaryModel.findOne({ workoutId: new Types.ObjectId(workoutId) }).exec();
        if (!summary) {
            throw new NotFoundException(`Workout summary for workout ${workoutId} not found`);
        }
        return summary;
    }
}
