import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async signin(signinDto: SigninDto): Promise<{ message: string }> {
        const { username, password, name, lastName } = signinDto;

        // Check if user already exists
        const existingUser = await this.userModel.findOne({ username }).exec();
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new this.userModel({
            username,
            password: hashedPassword,
            name,
            lastName,
        });

        await newUser.save();

        return { message: 'User registered successfully' };
    }

    async login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: { name: string; lastName: string; username: string; picture?: string; preferences: any };
    }> {
        const { username, password } = loginDto;

        // Find user by username
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);

        return {
            ...tokens,
            user: {
                name: user.name,
                lastName: user.lastName,
                username: user.username,
                picture: user.picture,
                preferences: user.preferences,
            },
        };
    }

    async validateGoogleUser(details: { email: string; firstName: string; lastName: string; picture?: string }) {
        const { email, firstName, lastName, picture } = details;

        // Check if user exists
        let user = await this.userModel.findOne({ username: email }).exec();

        if (user) {
            // Optional: Update picture if it changed?
            if (picture && user.picture !== picture) {
                user.picture = picture;
                await user.save();
            }
            return user;
        }

        // Create new user
        const placeholderPassword = await bcrypt.hash(Math.random().toString(36), 10);

        const newUser = new this.userModel({
            username: email,
            password: placeholderPassword,
            name: firstName,
            lastName: lastName,
            picture,
        });

        const savedUser = await newUser.save();
        return savedUser;
    }

    async getTokens(user: UserDocument) {
        const payload = {
            sub: user._id,
            username: user.username,
            name: user.name,
            lastName: user.lastName,
            picture: user.picture,
        };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: '7d',
            }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.userModel.findById(userId).exec();
        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Access Denied');
        }

        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new UnauthorizedException('Access Denied');
        }

        const tokens = await this.getTokens(user);
        await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);
        return tokens;
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    decodeToken(token: string) {
        return this.jwtService.decode(token);
    }

    generateJwt(user: UserDocument) {
        const payload = {
            sub: user._id,
            username: user.username,
            name: user.name,
            lastName: user.lastName,
            picture: user.picture,
        };
        return this.jwtService.sign(payload);
    }

    async updatePreferences(userId: string, preferences: any) {
        return this.userModel.findByIdAndUpdate(
            userId,
            { $set: { preferences } },
            { new: true },
        ).exec();
    }

    async updateUser(userId: string, updateDto: { username?: string; picture?: string }) {
        if (updateDto.username) {
            const existingUser = await this.userModel.findOne({
                username: updateDto.username,
                _id: { $ne: userId }
            }).exec();

            if (existingUser) {
                throw new ConflictException('Username already taken');
            }
        }

        return this.userModel.findByIdAndUpdate(
            userId,
            { $set: updateDto },
            { new: true }
        ).exec();
    }

    async getUserById(userId: string) {
        return this.userModel.findById(userId).exec();
    }
}
