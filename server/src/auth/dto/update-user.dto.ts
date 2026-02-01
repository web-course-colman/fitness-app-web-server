import { IsString, IsOptional, IsUrl, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MinLength(3)
    username?: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    picture?: string;
}
