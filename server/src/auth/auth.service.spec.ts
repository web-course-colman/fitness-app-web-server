import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Post } from '../posts/schemas/post.schema';
import { AchievementsService } from '../achievements/achievements.service';
import { UserProfilesService } from '../user-profiles/user-profiles.service';

// Mock bcrypt globally
jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let userModel: any;
    let jwtService: JwtService;

    const mockUser = {
        _id: 'userId',
        username: 'testuser',
        password: 'hashedpassword',
        name: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        save: jest.fn(),
        refreshToken: 'hashedRefreshToken',
    };

    // Create a mock class that can be instantiated AND has static methods
    class MockUserModel {
        constructor(public data: any) {
            Object.assign(this, data);
        }
        save = jest.fn().mockResolvedValue(mockUser);
        static findOne = jest.fn();
        static findById = jest.fn();
        static create = jest.fn();
        static findByIdAndUpdate = jest.fn();
        static find = jest.fn();
    }

    const mockJwtService = {
        signAsync: jest.fn(),
        sign: jest.fn(),
        decode: jest.fn(),
    };

    const mockAchievementsService = {
        findUserAchievements: jest.fn(),
        getXpAndLevel: jest.fn(),
    };

    const mockUserProfilesService = {
        findByUser: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: MockUserModel,
                },
                {
                    provide: getModelToken(Post.name),
                    useValue: {
                        countDocuments: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: AchievementsService,
                    useValue: mockAchievementsService,
                },
                {
                    provide: UserProfilesService,
                    useValue: mockUserProfilesService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userModel = module.get(getModelToken(User.name));
        jwtService = module.get<JwtService>(JwtService);

        // Clear mocks
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signin', () => {
        it('should register a new user', async () => {
            (MockUserModel.findOne as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
            (bcrypt.hash as any).mockResolvedValue('hashedpassword');

            const result = await service.signin({
                username: 'newuser',
                password: 'password',
                name: 'New',
                lastName: 'User',
                email: 'new@example.com',
            });

            expect(result).toEqual({ message: 'User registered successfully' });
        });

        it('should throw ConflictException if username exists', async () => {
            (MockUserModel.findOne as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) });

            await expect(
                service.signin({
                    username: 'testuser',
                    password: 'password',
                    name: 'Test',
                    lastName: 'User',
                    email: 'test@example.com',
                }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        it('should return tokens on successful login', async () => {
            (MockUserModel.findOne as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) });
            (bcrypt.compare as any).mockResolvedValue(true);
            mockJwtService.signAsync.mockResolvedValue('token');
            // Mock updateRefreshToken to avoid actual logic which also uses bcrypt
            jest.spyOn(service, 'updateRefreshToken').mockResolvedValue(undefined);

            const result = await service.login({ username: 'testuser', password: 'password' });

            expect(result).toHaveProperty('access_token');
            expect(result).toHaveProperty('refresh_token');
            expect(result).toHaveProperty('user');
        });

        it('should throw UnauthorizedException on invalid credentials', async () => {
            (MockUserModel.findOne as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

            await expect(
                service.login({ username: 'unknown', password: 'password' }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
