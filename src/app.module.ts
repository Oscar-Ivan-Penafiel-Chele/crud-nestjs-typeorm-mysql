import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostUserModule } from './posts-user/post-user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Admin.123.@$',
      database: 'nestdb',
      entities: [__dirname + '/**/entities/*.entity.[.ts,.js]'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    PostUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
