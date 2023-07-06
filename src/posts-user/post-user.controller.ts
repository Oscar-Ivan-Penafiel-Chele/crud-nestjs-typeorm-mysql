import { Controller, Post, Body, Get } from '@nestjs/common';
import { PostUserService } from './post-user.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostUserController {
  constructor(private postService: PostUserService) {}

  @Post()
  createPost(@Body() post: CreatePostDto) {
    return this.postService.createPost(post);
  }

  @Get()
  getPosts() {
    return this.postService.getPosts();
  }
}
