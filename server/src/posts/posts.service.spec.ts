import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Post } from './schemas/post.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

// Mock Model Class
class MockPostModel {
    constructor(public data: any) {
        Object.assign(this, data);
    }
    save = jest.fn().mockImplementation(function () { return Promise.resolve({ _id: '507f1f77bcf86cd799439013', ...this }); });
    static find = jest.fn();
    static findById = jest.fn();
    static findByIdAndUpdate = jest.fn();
    static findOneAndUpdate = jest.fn();
    static findByIdAndDelete = jest.fn();
    static countDocuments = jest.fn();
}

describe('PostsService', () => {
    let service: PostsService;
    let userModel: any;
    let eventEmitter: EventEmitter2;

    const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };

    beforeEach(async () => {
        MockPostModel.find.mockReturnValue(mockQuery);
        MockPostModel.findById.mockReturnValue(mockQuery);
        MockPostModel.findByIdAndUpdate.mockReturnValue(mockQuery);
        MockPostModel.findOneAndUpdate.mockReturnValue(mockQuery);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostsService,
                {
                    provide: getModelToken(Post.name),
                    useValue: MockPostModel,
                },
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                    },
                },
                {
                    provide: EventEmitter2,
                    useValue: { emit: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<PostsService>(PostsService);
        userModel = module.get(getModelToken(User.name));
        eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a post', async () => {
            const dto = {
                title: 'T',
                description: 'D',
                src: 's',
                pictures: ['p'],
                workoutDetails: {},
                likes: [],
                likesNumber: 0
            };
            const userId = '507f1f77bcf86cd799439011';

            userModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: userId }) });
            userModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn() });

            const result = await service.create(dto, userId);

            expect(result).toBeDefined();
            expect(userModel.findById).toHaveBeenCalledWith(userId);
        });
    });

    describe('findAll', () => {
        it('should return array of posts', async () => {
            mockQuery.exec.mockResolvedValue([new MockPostModel({})]);
            const result = await service.findAll();
            expect(result).toHaveLength(1);
            expect(MockPostModel.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a post', async () => {
            mockQuery.exec.mockResolvedValue(new MockPostModel({}));
            const result = await service.findOne('507f1f77bcf86cd799439011');
            expect(result).toBeDefined();
        });

        // Note: findOne implementation in service might not handle "not found" by returning null but throwing or just returning null.
        // The service impl: returns `this.postModel.findById(id)...`
    });
});
