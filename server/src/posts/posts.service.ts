import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

export interface PaginationResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private eventEmitter: EventEmitter2,
    ) { }

    async create(createPostDto: CreatePostDto, userId: string): Promise<PostDocument> {
        const createdPost = new this.postModel({
            ...createPostDto,
            author: new Types.ObjectId(userId),
        });
        const post = await createdPost.save();

        // Update user streak
        await this.updateUserStreak(userId);

        // Emit event for background AI processing
        this.eventEmitter.emit('workout.created', {
            postId: post._id.toString(),
            userId: userId,
        });

        return post;
    }

    private async updateUserStreak(userId: string): Promise<void> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) return;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (!user.lastPostDate) {
            // First post ever
            await this.userModel.findByIdAndUpdate(userId, {
                streak: 1,
                lastPostDate: now,
            }).exec();
            return;
        }

        const lastPostDate = new Date(user.lastPostDate);
        const lastPostDay = new Date(lastPostDate.getFullYear(), lastPostDate.getMonth(), lastPostDate.getDate());

        const daysDifference = Math.floor((today.getTime() - lastPostDay.getTime()) / (1000 * 60 * 60 * 24));

        let newStreak: number;

        if (daysDifference === 0) {
            // Same day - maintain streak
            newStreak = user.streak || 1;
        } else if (daysDifference === 1) {
            // Next consecutive day - increment streak
            newStreak = (user.streak || 0) + 1;
        } else {
            // Gap in posting - reset to 1
            newStreak = 1;
        }

        await this.userModel.findByIdAndUpdate(userId, {
            streak: newStreak,
            lastPostDate: now,
        }).exec();
    }

    async findAll(): Promise<PostDocument[]> {
        return this.postModel.find().populate('author', '-password').populate('comments.author', '-password').sort({ createdAt: -1 }).exec();
    }

    async findAllPaginated(params: { page?: string; limit?: string }): Promise<PaginationResult<PostDocument>> {
        const rawPage = Number(params.page);
        const rawLimit = Number(params.limit);

        const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
        const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : 10;
        const safeLimit = Math.min(Math.max(limit, 1), 50);

        const skip = (page - 1) * safeLimit;

        const [items, total] = await Promise.all([
            this.postModel
                .find()
                .populate('author', '-password')
                .populate('comments.author', '-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.postModel.countDocuments().exec(),
        ]);

        const totalPages = Math.max(1, Math.ceil(total / safeLimit));

        return {
            items,
            total,
            page,
            limit: safeLimit,
            totalPages,
        };
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
