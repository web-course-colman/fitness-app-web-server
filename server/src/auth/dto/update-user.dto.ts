import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MinLength(3)
    username?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    picture?: string;
}
