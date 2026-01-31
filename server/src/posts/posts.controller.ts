import { Controller, Get, Post, Body, UseGuards, Request, Param, NotFoundException, Put } from '@nestjs/common';
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
    async findAll() {
        return this.postsService.findAll();
    }

    @Get('author/:userId')
    async findByAuthor(@Param('userId') userId: string) {
        return this.postsService.findByAuthor(userId);
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
