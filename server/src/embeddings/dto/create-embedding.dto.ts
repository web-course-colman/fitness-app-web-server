import { IsNotEmpty, IsString, IsArray, IsEnum, IsNumber } from 'class-validator';

export class CreateEmbeddingDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsEnum(['workout_summary', 'workout'])
    refType: string;

    @IsNotEmpty()
    @IsString()
    refId: string;

    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    vector: number[];

    @IsNotEmpty()
    @IsString()
    text: string;
}
