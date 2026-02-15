import { Test, TestingModule } from '@nestjs/testing';
import { EmbeddingsController } from './embeddings.controller';
import { EmbeddingsService } from './embeddings.service';

describe('EmbeddingsController', () => {
    let controller: EmbeddingsController;
    let service: EmbeddingsService;

    const mockService = {
        create: jest.fn(),
        findByUser: jest.fn(),
        findByReference: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmbeddingsController],
            providers: [
                {
                    provide: EmbeddingsService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<EmbeddingsController>(EmbeddingsController);
        service = module.get<EmbeddingsService>(EmbeddingsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create', async () => {
            const dto = { userId: 'uid', refType: 'workout' as const, refId: 'rid', vector: [1], text: 't' };
            mockService.create.mockResolvedValue('embedding');
            expect(await controller.create(dto)).toBe('embedding');
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findByReference', () => {
        it('should call service.findByReference', async () => {
            mockService.findByReference.mockResolvedValue([]);
            expect(await controller.findByReference('workout', 'rid')).toEqual([]);
            expect(service.findByReference).toHaveBeenCalledWith('workout', 'rid');
        });
    });
});
