import { Controller, Post, Get, Body, HttpCode, HttpStatus, Res, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
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
        res.redirect('http://localhost:8080/feed');
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req: any) {
        const user = await this.authService.getUserById(req.user.userId);
        return user;
    }

    @Post('profile')
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
        const userId = req.user.userId;
        return this.authService.updateUser(userId, updateUserDto);
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
}
