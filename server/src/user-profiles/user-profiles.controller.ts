import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Controller('user-profiles')
export class UserProfilesController {
    constructor(private readonly userProfilesService: UserProfilesService) { }

    @Post()
    upsert(@Body() createDto: CreateUserProfileDto) {
        return this.userProfilesService.upsert(createDto);
    }

    @Get(':userId')
    findByUser(@Param('userId') userId: string) {
        return this.userProfilesService.findByUser(userId);
    }
}
