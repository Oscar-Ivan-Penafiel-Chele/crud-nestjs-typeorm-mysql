import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostUser } from './entities/post-user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostUserService {
  constructor(
    private userService: UsersService,
    @InjectRepository(PostUser) private postRepository: Repository<PostUser>,
  ) {}

  getPosts() {
    return this.postRepository.find({
      relations: ['author'],
    });
  }

  createPost(post: CreatePostDto) {
    const userFound = this.userService.getUserById(post.authorId);

    if (!userFound) {
      return new HttpException(' ', HttpStatus.NOT_FOUND);
    }

    const newPost = this.postRepository.create(post);
    return this.postRepository.save(newPost);
  }
}
