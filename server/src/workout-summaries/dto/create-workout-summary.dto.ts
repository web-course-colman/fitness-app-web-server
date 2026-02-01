import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateWorkoutSummaryDto {
    @IsNotEmpty()
    @IsString()
    workoutId: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsOptional()
    @IsString()
    summaryText?: string;

    @IsOptional()
    @IsObject()
    summaryJson?: Record<string, any>;
}
