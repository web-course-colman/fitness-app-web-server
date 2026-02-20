import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostsController', () => {
    let controller: PostsController;
    let service: PostsService;

    const mockPostsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findAllPaginated: jest.fn(),
        findOne: jest.fn(),
        findByAuthor: jest.fn(),
        findByAuthorPaginated: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        addComment: jest.fn(),
        deleteComment: jest.fn(),
        updateComment: jest.fn(),
        likePost: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostsController],
            providers: [
                {
                    provide: PostsService,
                    useValue: mockPostsService,
                },
            ],
        }).compile();

        controller = module.get<PostsController>(PostsController);
        service = module.get<PostsService>(PostsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a post', async () => {
            const dto: CreatePostDto = { title: 'T', description: 'D', src: 's', pictures: ['p'], workoutDetails: {} };
            const req = { user: { userId: 'uid' } };
            mockPostsService.create.mockResolvedValue('createdPost');

            expect(await controller.create(dto, req, [])).toBe('createdPost');
            expect(service.create).toHaveBeenCalledWith(dto, 'uid');
        });
    });

    describe('findAll', () => {
        it('should return all posts', async () => {
            mockPostsService.findAll.mockResolvedValue(['post']);
            expect(await controller.findAll()).toEqual(['post']);
        });
    });

    describe('findOne', () => {
        it('should return one post', async () => {
            mockPostsService.findOne.mockResolvedValue('post');
            expect(await controller.findOne('id')).toBe('post');
        });
    });
});
