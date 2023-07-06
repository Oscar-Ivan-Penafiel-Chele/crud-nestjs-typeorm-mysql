import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostUserService } from './post-user.service';
import { PostUserController } from './post-user.controller';
import { PostUser } from './entities/post-user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostUser]), UsersModule],
  controllers: [PostUserController],
  providers: [PostUserService],
})
export class PostUserModule {}
