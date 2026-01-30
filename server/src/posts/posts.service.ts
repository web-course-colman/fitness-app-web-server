import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async create(createPostDto: CreatePostDto, userId: string): Promise<PostDocument> {
        const createdPost = new this.postModel({
            ...createPostDto,
            author: new Types.ObjectId(userId),
        });
        return createdPost.save();
    }

    async findAll(): Promise<PostDocument[]> {
        return this.postModel.find().populate('author', '-password').sort({ createdAt: -1 }).exec();
    }

    async findByAuthor(authorId: string): Promise<PostDocument[]> {
        return this.postModel.find({ author: authorId }).populate('author', '-password').sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<PostDocument | null> {
        return this.postModel.findById(id).populate('author', '-password').exec();
    }

    async likePost(postId: string, userWhoLikeId: string): Promise<PostDocument | null> {
        const doc = await this.postModel.findById(postId).exec();
        const user = await this.userModel.findById(userWhoLikeId, { _id: 1, username: 1, picture: 1 }).exec();

        if (!doc) throw new NotFoundException(`Post ${postId} not found`);
        if (!user) throw new NotFoundException(`User id ${userWhoLikeId} not found`);

        if (!doc.likes) {
            doc.likes = [];
        }

        const exists = doc.likes.find(like => like.username === user.username);

        if (!exists) {
            doc.likes.push(user);
            doc.likeNumber++;
        } else {
            doc.likes = doc.likes.filter(like => like.username !== user.username);
            doc.likeNumber--;
        }

        doc.markModified('likes');
        const saved = await doc.save();
        return saved;
    }
}
