import { Controller, Sse, MessageEvent, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Sse('stream')
    stream(@Request() req): Observable<MessageEvent> {
        return this.notificationsService.stream(req.user.userId);
    }
}
