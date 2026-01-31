import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
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
        return this.postModel.find({ author: authorId }).populate('author', '-password').populate('comments.author', '-password').sort({ createdAt: -1 }).exec();
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
}
