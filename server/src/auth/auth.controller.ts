import { Controller, Post, Get, Body, HttpCode, HttpStatus, Res, UseGuards, Req, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SigninDto } from './dto/signin.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signin')
    async signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
        const result = await this.authService.login(loginDto);
        response.cookie('Authentication', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000, // 15 mins
        });
        response.cookie('Refresh', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return result;
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const user = req.user;
        const tokens = await this.authService.getTokens(user);
        await this.authService.updateRefreshToken(user._id.toString(), tokens.refresh_token);

        res.cookie('Authentication', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('Refresh', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        if (process.env.NODE_ENV === 'production') {
            res.redirect(`http://localhost:${process.env.PORT}/feed`);
        } else {
            res.redirect('http://localhost:8080/feed');
        }
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req: any) {
        const user = await this.authService.getUserById(req.user.userId);
        return user;
    }

    @Post('profile')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/avatars',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit
        },
    }))
    async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: any) {
        const userId = req.user.userId;

        // If a file was uploaded, update the picture field with the full URL
        if (file) {
            const port = process.env.PORT || '3002';
            const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;
            updateUserDto.picture = `${serverUrl}/uploads/avatars/${file.filename}`;
        }

        const updatedUser = await this.authService.updateUser(userId, updateUserDto);

        if (!updatedUser) {
            throw new UnauthorizedException('User not found');
        }

        return updatedUser;
    }

    @Get('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['Refresh'];
        const user: any = this.authService.decodeToken(refreshToken); // Need decode method or just jwtService
        if (!user) throw new UnauthorizedException();

        const tokens = await this.authService.refreshTokens(user.sub, refreshToken);

        res.cookie('Authentication', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('Refresh', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { success: true };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('Authentication');
        response.clearCookie('Refresh');
        return { message: 'Logged out' };
    }

    @Post('preferences')
    @UseGuards(AuthGuard('jwt'))
    async updatePreferences(@Req() req, @Body() updatePreferencesDto: UpdatePreferencesDto) {
        const userId = req.user.userId;
        return this.authService.updatePreferences(userId, updatePreferencesDto);
    }

    @Get('search')
    @UseGuards(AuthGuard('jwt'))
    async searchUsers(@Req() req: any) {
        const query = req.query.q || '';
        return this.authService.searchUsers(query);
    }
}
