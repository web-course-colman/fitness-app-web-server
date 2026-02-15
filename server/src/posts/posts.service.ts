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

    async update(id: string, updatePostDto: any, userId: string): Promise<PostDocument | null> {
        const post = await this.postModel.findById(id);
        if (!post) {
            return null;
        }

        if (post.author.toString() !== userId) {
            return null; // Or throw specific forbidden exception
        }

        const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true })
            .populate('author', '-password')
            .populate('comments.author', '-password')
            .exec();

        if (updatedPost) {
            this.eventEmitter.emit('workout.updated', {
                postId: updatedPost._id.toString(),
                userId: userId,
            });
        }

        return updatedPost;
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

    async findAll(userId?: string): Promise<PostDocument[]> {
        let query: any = this.postModel.find().populate('author', '-password').select('-comments').sort({ createdAt: -1 });

        if (userId) {
            const user = await this.userModel.findById(userId);
            if (user) {
                query = query.select({ likes: { $elemMatch: { username: user.username } }, title: 1, description: 1, src: 1, pictures: 1, likeNumber: 1, commentsNumber: 1, workoutDetails: 1, author: 1, createdAt: 1, updatedAt: 1 });
            }
        } else {
            query = query.select('-likes');
        }

        return query.exec();
    }

    async findAllPaginated(params: { page?: string; limit?: string }, userId?: string): Promise<PaginationResult<PostDocument>> {
        const rawPage = Number(params.page);
        const rawLimit = Number(params.limit);

        const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
        const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : 10;
        const safeLimit = Math.min(Math.max(limit, 1), 50);

        const skip = (page - 1) * safeLimit;

        let query: any = this.postModel
            .find()
            .populate('author', '-password')
            .select('-comments')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit);

        if (userId) {
            const user = await this.userModel.findById(userId);
            if (user) {
                query = query.select({ likes: { $elemMatch: { username: user.username } }, title: 1, description: 1, src: 1, pictures: 1, likeNumber: 1, commentsNumber: 1, workoutDetails: 1, author: 1, createdAt: 1, updatedAt: 1 });
            }
        } else {
            query = query.select('-likes');
        }

        const [items, total] = await Promise.all([
            query.exec(),
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

    async findByAuthor(authorId: string, viewersId?: string): Promise<PostDocument[]> {
        let query: any = this.postModel.find({ author: new Types.ObjectId(authorId) }).populate('author', '-password').select('-comments').sort({ createdAt: -1 });

        if (viewersId) {
            const user = await this.userModel.findById(viewersId);
            if (user) {
                query = query.select({ likes: { $elemMatch: { username: user.username } }, title: 1, description: 1, src: 1, pictures: 1, likeNumber: 1, commentsNumber: 1, workoutDetails: 1, author: 1, createdAt: 1, updatedAt: 1 });
            }
        } else {
            query = query.select('-likes');
        }

        return query.exec();
    }

    async findByAuthorPaginated(authorId: string, params: { page?: string; limit?: string }, viewersId?: string): Promise<PaginationResult<PostDocument>> {
        const rawPage = Number(params.page);
        const rawLimit = Number(params.limit);

        const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
        const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : 10;
        const safeLimit = Math.min(Math.max(limit, 1), 50);

        const skip = (page - 1) * safeLimit;
        const filter = { author: new Types.ObjectId(authorId) };

        let query: any = this.postModel
            .find(filter)
            .populate('author', '-password')
            .select('-comments')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit);

        if (viewersId) {
            const user = await this.userModel.findById(viewersId);
            if (user) {
                query = query.select({ likes: { $elemMatch: { username: user.username } }, title: 1, description: 1, src: 1, pictures: 1, likeNumber: 1, commentsNumber: 1, workoutDetails: 1, author: 1, createdAt: 1, updatedAt: 1 });
            }
        } else {
            query = query.select('-likes');
        }

        const [items, total] = await Promise.all([
            query.exec(),
            this.postModel.countDocuments(filter).exec(),
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

    async findOne(id: string): Promise<PostDocument | null> {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }
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
                $inc: { commentsNumber: 1 },
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

    async deleteComment(postId: string, commentId: string, userId: string): Promise<PostDocument | null> {
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException(`Post ${postId} not found`);

        const comment = post.comments.find(c => (c as any)._id.toString() === commentId);
        if (!comment) throw new NotFoundException(`Comment ${commentId} not found`);

        if (comment.author.toString() !== userId) {
            throw new NotFoundException(`You are not authorized to delete this comment`);
        }

        return this.postModel.findByIdAndUpdate(
            postId,
            {
                $pull: {
                    comments: { _id: new Types.ObjectId(commentId) }
                },
                $inc: { commentsNumber: -1 },
            },
            { new: true }
        ).populate('author', '-password').populate('comments.author', '-password').exec();
    }

    async updateComment(postId: string, commentId: string, userId: string, content: string): Promise<PostDocument | null> {
        const post = await this.postModel.findById(postId);
        if (!post) throw new NotFoundException(`Post ${postId} not found`);

        const comment = post.comments.find(c => (c as any)._id.toString() === commentId);
        if (!comment) throw new NotFoundException(`Comment ${commentId} not found`);

        if (comment.author.toString() !== userId) {
            throw new NotFoundException(`You are not authorized to update this comment`);
        }

        return this.postModel.findOneAndUpdate(
            { _id: postId, "comments._id": new Types.ObjectId(commentId) },
            {
                $set: {
                    "comments.$.content": content
                }
            },
            { new: true }
        ).populate('author', '-password').populate('comments.author', '-password').exec();
    }

    async delete(id: string, userId: string): Promise<void> {
        const post = await this.postModel.findById(id);
        if (!post) throw new NotFoundException(`Post ${id} not found`);

        if (post.author.toString() !== userId) {
            throw new NotFoundException(`You are not authorized to delete this post`);
        }

        await this.postModel.findByIdAndDelete(id);

        this.eventEmitter.emit('workout.deleted', {
            postId: id,
            userId: userId,
        });

        await this.recalculateUserStreak(userId);
    }

    private async recalculateUserStreak(userId: string): Promise<void> {
        const user = await this.userModel.findById(userId);
        if (!user) return;

        const posts = await this.postModel.find({ author: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .select('createdAt')
            .exec();

        if (posts.length === 0) {
            await this.userModel.findByIdAndUpdate(userId, {
                streak: 0,
                lastPostDate: null
            });
            return;
        }

        let currentStreak = 0;
        let lastDate: Date | null = null;

        // Use a Set to track unique dates (YYYY-MM-DD) to handle multiple posts per day
        const uniqueDates = new Set<string>();
        const sortedUniqueDates: Date[] = [];

        posts.forEach(post => {
            if (!post.createdAt) return;
            const date = new Date(post.createdAt);
            const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            if (!uniqueDates.has(dateStr)) {
                uniqueDates.add(dateStr);
                // Create date object for midnight of that day to compare properly
                sortedUniqueDates.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
            }
        });

        if (sortedUniqueDates.length === 0) return;

        // Check if the most recent post was today or yesterday to maintain active streak
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const lastPostDate = sortedUniqueDates[0];
        // If last post was older than yesterday, streak is broken (effectively 0 for "current" streak context, 
        // but we might want to calculate the longest chain ending at lastPostDate)
        // However, usually "streak" implies current active streak. 
        // If the user deleted the only post from today, and has a post yesterday, streak should be preserved?
        // Let's count backwards from the most recent post.

        currentStreak = 1;
        for (let i = 0; i < sortedUniqueDates.length - 1; i++) {
            const current = sortedUniqueDates[i];
            const next = sortedUniqueDates[i + 1]; // This is actually the "previous" day in time since we sorted DESC

            const diffTime = Math.abs(current.getTime() - next.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentStreak++;
            } else {
                break;
            }
        }

        // If the last post is not today or yesterday, the "active" streak is actually 0
        // But normally we store the streak value of the last chain.
        // Let's stick to the logic: Streak is the count of consecutive days ending at lastPostDate.
        // We also update lastPostDate to the actual last post's date.

        await this.userModel.findByIdAndUpdate(userId, {
            streak: currentStreak,
            lastPostDate: posts[0].createdAt // Keep the timestamp of the actual last post
        });
    }
}
