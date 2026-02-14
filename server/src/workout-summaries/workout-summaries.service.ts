import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkoutSummary, WorkoutSummaryDocument } from './schemas/workout-summary.schema';
import { CreateWorkoutSummaryDto } from './dto/create-workout-summary.dto';

@Injectable()
export class WorkoutSummariesService {
    private readonly logger = new Logger(WorkoutSummariesService.name);

    constructor(
        @InjectModel(WorkoutSummary.name)
        private workoutSummaryModel: Model<WorkoutSummaryDocument>,
        private eventEmitter: EventEmitter2,
    ) { }

    async create(createDto: CreateWorkoutSummaryDto): Promise<WorkoutSummaryDocument> {
        const createdSummary = new this.workoutSummaryModel({
            ...createDto,
            workoutId: new Types.ObjectId(createDto.workoutId),
            userId: new Types.ObjectId(createDto.userId),
            status: 'pending',
        });
        return createdSummary.save();
    }

    async updateStatus(id: string, status: 'completed' | 'failed', data: Partial<WorkoutSummary>): Promise<WorkoutSummaryDocument> {
        const summary = await this.workoutSummaryModel.findByIdAndUpdate(
            id,
            { ...data, status },
            { new: true }
        ).exec();
        if (!summary) {
            throw new NotFoundException(`Workout summary ${id} not found`);
        }

        if (status === 'completed') {
            this.eventEmitter.emit('workout.summary.completed', {
                summaryId: summary._id.toString(),
                userId: summary.userId.toString(),
                workoutId: summary.workoutId.toString(),
                summaryJson: summary.summaryJson,
            });
        }

        return summary;
    }

    async findAll(): Promise<WorkoutSummary[]> {
        return this.workoutSummaryModel.find().exec();
    }

    async findByUser(userId: string): Promise<WorkoutSummary[]> {
        return this.workoutSummaryModel.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    async findByWorkout(workoutId: string): Promise<WorkoutSummaryDocument> {
        const summary = await this.workoutSummaryModel.findOne({ workoutId: new Types.ObjectId(workoutId) }).exec();
        if (!summary) {
            throw new NotFoundException(`Workout summary for workout ${workoutId} not found`);
        }
        return summary;
    }
}
