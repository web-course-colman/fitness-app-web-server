import { Controller, Post, Get, Body, HttpCode, HttpStatus, Res, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SigninDto } from './dto/signin.dto';

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
        const token = this.authService.generateJwt(user);
        res.cookie('Authentication', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.redirect('http://localhost:8080/feed');
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Req() req: Request) {
        return req.user;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('Authentication');
        return { message: 'Logged out' };
    }
}
