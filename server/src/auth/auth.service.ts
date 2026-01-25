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
        user: { name: string; lastName: string; username: string };
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

        // Generate JWT token
        const payload = {
            sub: user._id,
            username: user.username,
            name: user.name,
            lastName: user.lastName,
        };

        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                name: user.name,
                lastName: user.lastName,
                username: user.username,
            },
        };
    }
}
