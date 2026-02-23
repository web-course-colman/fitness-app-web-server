import { Controller, Post, Body, UseGuards, Request, Sse, MessageEvent } from '@nestjs/common';
import { CoachService } from './coach.service';
import { AskCoachDto } from './dto/ask-coach.dto';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Controller('coach')
export class CoachController {
    constructor(private readonly coachService: CoachService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('ask-stream')
    @Sse('ask-stream')
    askStream(@Body() askCoachDto: AskCoachDto, @Request() req): Observable<MessageEvent> {
        return this.coachService.askStream(req.user.userId, askCoachDto.question);
    }
}
