import { Controller, Get, Post, Body, UseGuards, Request, Param, NotFoundException, Put, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createPostDto: CreatePostDto, @Request() req) {
        return this.postsService.create(createPostDto, req.user.userId);
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
}
