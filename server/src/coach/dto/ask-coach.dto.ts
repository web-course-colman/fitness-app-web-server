import { IsNotEmpty, IsString } from 'class-validator';

export class AskCoachDto {
    @IsNotEmpty()
    @IsString()
    question: string;
}
