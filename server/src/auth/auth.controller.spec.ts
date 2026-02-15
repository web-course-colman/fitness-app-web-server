import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        signin: jest.fn(),
        login: jest.fn(),
        getTokens: jest.fn(),
        updateRefreshToken: jest.fn(),
        getUserById: jest.fn(),
        updateUser: jest.fn(),
        refreshTokens: jest.fn(),
        decodeToken: jest.fn(),
        updatePreferences: jest.fn(),
        searchUsers: jest.fn(),
    };

    const mockResponse = {
        cookie: jest.fn(),
        clearCookie: jest.fn(),
        redirect: jest.fn(),
    } as unknown as Response;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('signin', () => {
        it('should call authService.signin', async () => {
            const dto = { username: 'user', password: 'pass', name: 'N', lastName: 'L', email: 'e' };
            await controller.signin(dto);
            expect(authService.signin).toHaveBeenCalledWith(dto);
        });
    });

    describe('login', () => {
        it('should return tokens and set cookies', async () => {
            const dto = { username: 'user', password: 'pass' };
            const result = {
                access_token: 'at',
                refresh_token: 'rt',
                user: { name: 'N', lastName: 'L', username: 'user', preferences: {} },
            };
            mockAuthService.login.mockResolvedValue(result);

            const resp = await controller.login(dto, mockResponse);

            expect(resp).toEqual(result);
            expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
        });
    });

    describe('logout', () => {
        it('should clear cookies', async () => {
            await controller.logout(mockResponse);
            expect(mockResponse.clearCookie).toHaveBeenCalledWith('Authentication');
            expect(mockResponse.clearCookie).toHaveBeenCalledWith('Refresh');
        });
    });
});
