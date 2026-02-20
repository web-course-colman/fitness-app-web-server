import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('achievements')
@UseGuards(AuthGuard('jwt'))
export class AchievementsController {
    constructor(private readonly achievementsService: AchievementsService) { }

    @Get()
    async getAllAchievements() {
        return this.achievementsService.findAll();
    }

    @Get('me')
    async getMyAchievements(@Request() req) {
        return this.achievementsService.findUserAchievements(req.user.userId);
    }

    @Get('xp')
    async getMyXp(@Request() req) {
        return this.achievementsService.getXpAndLevel(req.user.userId);
    }
}
