import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,
  ) {}

  async findUserByEmailOrSave(email: string, name: string, providerId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      if (user) return user;

      const newUser = this.userRepository.create({
        name,
        email,
        providerId,
      });

      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } catch (error) {
      // db error는 로깅 후 400으로 반환
      console.log('Error in findUserByEmailOrSave');
      throw new BadRequestException();
    }
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException();
      }

      user.refresh_token = refreshToken;

      await this.userRepository.save(user);
    } catch (error) {
      // db error는 로깅 후 400으로 반환
      console.log('Error while save refresh token');
      throw new BadRequestException();
    }
  }

  async findUserById(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch (error) {
      // db error는 로깅 후 400으로 반환
      console.log('Error while find user by id');
      throw new BadRequestException();
    }
  }

  async findRefreshTokenByUserId(userId: number) {
    try {
      const user = await this.findUserById(userId);
      if (!user) throw new NotFoundException();

      return user.refresh_token;
    } catch (error) {
      // db error는 로깅 후 400으로 반환
      console.log('Error while find refresh token by user_id');
      throw new BadRequestException();
    }
  }

  async deleteRefreshToken(userId: number) {
    try {
      await this.userRepository.update(userId, { refresh_token: null });
    } catch {
      console.log('Error while delete refresh token by user_id');
      throw new BadRequestException();
    }
  }
}
