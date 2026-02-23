import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { of } from 'rxjs';

describe('NotificationsController', () => {
    let controller: NotificationsController;
    let service: NotificationsService;

    const mockNotificationsService = {
        stream: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [
                {
                    provide: NotificationsService,
                    useValue: mockNotificationsService,
                },
            ],
        }).compile();

        controller = module.get<NotificationsController>(NotificationsController);
        service = module.get<NotificationsService>(NotificationsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('stream', () => {
        it('should return service stream', () => {
            const mockStream = of({ data: 'test' });
            mockNotificationsService.stream.mockReturnValue(mockStream);
            const req = { user: { userId: 'uid' } };
            expect(controller.stream(req)).toBe(mockStream);
            expect(service.stream).toHaveBeenCalledWith('uid');
        });
    });
});
