import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

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
      // TODO:
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
      // TODO:
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
      // TODO:
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
      // TODO:
      // db error는 로깅 후 400으로 반환
      console.log('Error while find refresh token by user_id');
      throw new BadRequestException();
    }
  }

  async deleteRefreshToken(userId: number) {
    try {
      await this.userRepository.update(userId, { refresh_token: null });
    } catch {
      // TODO:
      console.log('Error while delete refresh token by user_id');
      throw new BadRequestException();
    }
  }

  async getUserInfo(userId: number) {
    try {
      const user = await this.findUserById(userId);
      const totalUsers = await this.userRepository.count();
      const higherPointUsers = await this.userRepository.count({
        where: { point: MoreThan(user.point) },
      });

      const percentile = Math.floor(
        ((higherPointUsers + 1) / totalUsers) * 100,
      );

      return {
        ...user,
        rank: percentile,
      };
    } catch {
      // TODO:
      console.log('Error select user table in getUserInfo service');
      throw new BadRequestException();
    }
  }
}
