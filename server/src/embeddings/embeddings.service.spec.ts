import { Test, TestingModule } from '@nestjs/testing';
import { EmbeddingsService } from './embeddings.service';
import { getModelToken } from '@nestjs/mongoose';
import { Embedding } from './schemas/embedding.schema';

describe('EmbeddingsService', () => {
    let service: EmbeddingsService;
    let model: any;

    const mockEmbedding = {
        userId: 'uid',
        refType: 'workout',
        refId: 'rid',
        vector: [0.1, 0.2, 0.3],
        text: 'text',
        save: jest.fn(),
    };

    const mockModel = {
        new: jest.fn().mockImplementation(() => mockEmbedding),
        constructor: jest.fn().mockImplementation(() => mockEmbedding),
        findOneAndUpdate: jest.fn(),
        find: jest.fn(),
        deleteMany: jest.fn(),
    };

    const mockQuery = {
        exec: jest.fn(),
    };

    beforeEach(async () => {
        mockModel.findOneAndUpdate.mockReturnValue(mockQuery);
        mockModel.find.mockReturnValue(mockQuery);
        mockModel.deleteMany.mockReturnValue(mockQuery);

        // Mock for "new this.embeddingModel"
        class MockEmbeddingModel {
            constructor(public data: any) {
                Object.assign(this, data);
            }
            save = jest.fn().mockImplementation(function () { return Promise.resolve(this); });
            static findOneAndUpdate = jest.fn().mockReturnValue(mockQuery);
            static find = jest.fn().mockReturnValue(mockQuery);
            static deleteMany = jest.fn().mockReturnValue(mockQuery);
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmbeddingsService,
                {
                    provide: getModelToken(Embedding.name),
                    useValue: MockEmbeddingModel,
                },
            ],
        }).compile();

        service = module.get<EmbeddingsService>(EmbeddingsService);
        model = module.get(getModelToken(Embedding.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create an embedding', async () => {
            const dto = { userId: '507f1f77bcf86cd799439011', refType: 'workout' as const, refId: '507f1f77bcf86cd799439012', vector: [1], text: 't' };
            const result = await service.create(dto);
            expect(result).toBeDefined();
        });
    });

    describe('findSimilar', () => {
        it('should return sorted embeddings', async () => {
            const embeddings = [
                { vector: [1, 0, 0], id: 1 },
                { vector: [0, 1, 0], id: 2 }
            ];
            mockQuery.exec.mockResolvedValue(embeddings);

            // Vector [1, 0, 0] should match id 1 perfectly (score 1) and id 2 not at all (score 0)
            const result = await service.findSimilar([1, 0, 0], '507f1f77bcf86cd799439011');
            expect(result[0]).toEqual(embeddings[0]);
        });

        it('should apply limit', async () => {
            const embeddings = [
                { vector: [1, 0], id: 1 },
                { vector: [0.9, 0], id: 2 },
                { vector: [0.8, 0], id: 3 },
            ];
            mockQuery.exec.mockResolvedValue(embeddings);

            const result = await service.findSimilar([1, 0], '507f1f77bcf86cd799439011', 2);
            expect(result).toHaveLength(2);
        });
    });

    describe('update', () => {
        it('should update and return embedding', async () => {
            const updated = { id: 'updated' };
            mockQuery.exec.mockResolvedValue(updated);
            await expect(
                service.update('workout', '507f1f77bcf86cd799439011', [1, 2], 'text'),
            ).resolves.toEqual(updated);
        });
    });

    describe('findByUser', () => {
        it('should return embeddings by user', async () => {
            mockQuery.exec.mockResolvedValue([{ id: 1 }]);
            await expect(service.findByUser('507f1f77bcf86cd799439011')).resolves.toEqual([{ id: 1 }]);
        });
    });

    describe('findByReference', () => {
        it('should return embeddings by reference', async () => {
            mockQuery.exec.mockResolvedValue([{ id: 1 }]);
            await expect(service.findByReference('workout', '507f1f77bcf86cd799439011')).resolves.toEqual([{ id: 1 }]);
        });
    });

    describe('deleteByReference', () => {
        it('should delete embeddings by reference', async () => {
            const deleted = { acknowledged: true, deletedCount: 1 };
            mockQuery.exec.mockResolvedValue(deleted);
            await expect(service.deleteByReference('workout', '507f1f77bcf86cd799439011')).resolves.toEqual(deleted);
        });
    });
});
