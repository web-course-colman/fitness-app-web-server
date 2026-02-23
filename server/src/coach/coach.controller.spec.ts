import { Test, TestingModule } from '@nestjs/testing';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';

describe('CoachController', () => {
    let controller: CoachController;
    let service: CoachService;

    const mockService = {
        ask: jest.fn(),
        askStream: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CoachController],
            providers: [
                {
                    provide: CoachService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<CoachController>(CoachController);
        service = module.get<CoachService>(CoachService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('askStream', () => {
        it('should call service.askStream', () => {
            const obs = {};
            mockService.askStream.mockReturnValue(obs);
            const req = { user: { userId: 'uid' } };
            const dto = { question: 'q' };

            expect(controller.askStream(dto, req)).toBe(obs);
            expect(service.askStream).toHaveBeenCalledWith('uid', 'q');
        });
    });
});
