import { Controller, Get, Post, Body, UseGuards, Request, Param, NotFoundException, Put, Query, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/posts',
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
    async create(@Body() createPostDto: CreatePostDto, @Request() req, @UploadedFile() file: any) {
        if (file) {
            const port = process.env.PORT || '3002';
            const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;
            createPostDto.src = `${serverUrl}/uploads/posts/${file.filename}`;
        }

        // Handle workoutDetails if it comes as a string (multipart/form-data often sends objects as strings)
        if (typeof createPostDto.workoutDetails === 'string') {
            try {
                createPostDto.workoutDetails = JSON.parse(createPostDto.workoutDetails);
            } catch (e) {
                // Keep as is or handle error
            }
        }

        return this.postsService.create(createPostDto, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/posts',
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
    async update(@Param('id') id: string, @Body() updatePostDto: any, @Request() req, @UploadedFile() file: any) {
        if (file) {
            const port = process.env.PORT || '3002';
            const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;
            updatePostDto.src = `${serverUrl}/uploads/posts/${file.filename}`;
        }

        if (typeof updatePostDto.workoutDetails === 'string') {
            try {
                updatePostDto.workoutDetails = JSON.parse(updatePostDto.workoutDetails);
            } catch (e) {
            }
        }

        const updatedPost = await this.postsService.update(id, updatePostDto, req.user.userId);
        if (!updatedPost) {
            throw new NotFoundException(`Post with ID ${id} not found or you are not authorized to update it`);
        }
        return updatedPost;
    }

    @Get()
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        // Backwards compatible:
        // - If no pagination params are provided, return the full list (old behavior)
        // - If page and/or limit are provided, return a paginated response
        const hasPaginationParams = page !== undefined || limit !== undefined;

        if (!hasPaginationParams) {
            return this.postsService.findAll();
        }

        return this.postsService.findAllPaginated({ page, limit });
    }

    @Get('author/:userId')
    async findByAuthor(
        @Param('userId') userId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        // Backwards compatible (same pattern as GET /posts):
        // If pagination params are omitted -> return the full list
        const hasPaginationParams = page !== undefined || limit !== undefined;

        if (!hasPaginationParams) {
            return this.postsService.findByAuthor(userId);
        }

        return this.postsService.findByAuthorPaginated(userId, { page, limit });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('like')
    async likeOrUnlikePost(@Body('_id') postId: string, @Request() req) {
        try {
            return await this.postsService.likePost(postId, req.user.userId);
        } catch (err) {
            return err;
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/comments')
    async addComment(
        @Param('id') id: string,
        @Body() addCommentDto: AddCommentDto,
        @Request() req,
    ) {
        const post = await this.postsService.addComment(id, req.user.userId, addCommentDto.content);
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id/comments/:commentId')
    async deleteComment(
        @Param('id') id: string,
        @Param('commentId') commentId: string,
        @Request() req,
    ) {
        const post = await this.postsService.deleteComment(id, commentId, req.user.userId);
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id/comments/:commentId')
    async updateComment(
        @Param('id') id: string,
        @Param('commentId') commentId: string,
        @Body() body: { content: string },
        @Request() req,
    ) {
        const post = await this.postsService.updateComment(id, commentId, req.user.userId, body.content);
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }
}
