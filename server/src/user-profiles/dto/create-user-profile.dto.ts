import { IsNotEmpty, IsString, IsObject, IsNumber, MaxLength } from 'class-validator';

export class CreateUserProfileDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(2500)
    profileSummaryText: string;

    @IsNotEmpty()
    @IsObject()
    profileSummaryJson: Record<string, any>;

    @IsNotEmpty()
    @IsNumber()
    version: number;
}
