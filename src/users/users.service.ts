import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto, CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  protected readonly MESSAGE_NOT_FOUND = 'Usuario no encontrado';
  protected readonly MESSAGE_FOUND = 'Usuario fue encontrado';

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async searchUser(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  getUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['profile'],
    });
  }

  async getUserById(id: number): Promise<User | HttpException> {
    const userFound = await this.searchUser(id);

    if (!userFound) {
      return new HttpException(this.MESSAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async createUser(user: CreateUserDto): Promise<User | HttpException> {
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });

    if (userFound) {
      return new HttpException(this.MESSAGE_FOUND, HttpStatus.CONFLICT);
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  // : Promise<UpdateResult | HttpException>
  async updateUser(
    id: number,
    user: UpdateUserDto,
  ): Promise<(User & UpdateUserDto) | HttpException> {
    const userFound = await this.searchUser(id);

    if (!userFound) {
      return new HttpException(this.MESSAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const updateUser = Object.assign(userFound, user);
    return this.userRepository.save(updateUser);
  }

  async deleteUser(id: number): Promise<DeleteResult | HttpException> {
    const result = await this.userRepository.delete({ id });

    if (result.affected == 0) {
      return new HttpException(this.MESSAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async createProfile(
    id: number,
    profile: CreateProfileDto,
  ): Promise<User | HttpException> {
    const userFound = await this.searchUser(id);

    if (!userFound) {
      return new HttpException(this.MESSAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const newProfile = this.profileRepository.create(profile);
    const saveProfile = await this.profileRepository.save(newProfile);

    userFound.profile = saveProfile;

    return this.userRepository.save(userFound);
  }
}
