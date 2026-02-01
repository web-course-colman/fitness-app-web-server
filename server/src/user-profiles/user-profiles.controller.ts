import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { z } from 'zod';

const UserIdSchema = z.string().min(1);

@Controller('user-profiles')
export class UserProfilesController {
    constructor(private readonly userProfilesService: UserProfilesService) { }

    @Post()
    upsert(@Body() createDto: CreateUserProfileDto) {
        return this.userProfilesService.upsert(createDto);
    }

    @Get(':userId')
    findByUser(@Param('userId') userId: string) {
        UserIdSchema.parse(userId);
        return this.userProfilesService.findByUser(userId);
    }
}
