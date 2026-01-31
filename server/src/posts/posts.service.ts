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
        return this.postModel.find().populate('author', '-password').populate('comments.author', '-password').sort({ createdAt: -1 }).exec();
    }

    async findByAuthor(authorId: string): Promise<PostDocument[]> {
        return this.postModel.find({ author: new Types.ObjectId(authorId) }).populate('author', '-password').populate('comments.author', '-password').sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<PostDocument | null> {
        return this.postModel.findById(id).populate('author', '-password').populate('comments.author', '-password').exec();
    }

    async addComment(postId: string, userId: string, content: string): Promise<PostDocument | null> {
        return this.postModel.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        content,
                        author: new Types.ObjectId(userId),
                    },
                },
            },
            { new: true },
        ).populate('author', '-password').populate('comments.author', '-password').exec();
    }

    async likePost(postId: string, userWhoLikeId: string): Promise<PostDocument | null> {
        const user = await this.userModel.findById(userWhoLikeId, { _id: 1, username: 1, picture: 1 }).exec();
        if (!user) throw new NotFoundException(`User id ${userWhoLikeId} not found`);

        const post = await this.postModel.findById(postId).exec();
        if (!post) throw new NotFoundException(`Post ${postId} not found`);

        const isLiked = post.likes?.some(like => like.username === user.username);

        if (isLiked) {
            return this.postModel.findOneAndUpdate(
                { _id: postId, 'likes.username': user.username },
                {
                    $pull: { likes: { username: user.username } },
                    $inc: { likeNumber: -1 }
                },
                { new: true }
            ).populate('author', '-password').populate('comments.author', '-password').exec();
        } else {
            const likeData = { username: user.username, picture: user.picture };
            return this.postModel.findOneAndUpdate(
                { _id: postId, 'likes.username': { $ne: user.username } },
                {
                    $addToSet: { likes: likeData },
                    $inc: { likeNumber: 1 }
                },
                { new: true }
            ).populate('author', '-password').populate('comments.author', '-password').exec();
        }
    }
}
