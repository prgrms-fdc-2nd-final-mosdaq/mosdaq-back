import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
      throw new HttpException(
        'Error finding or saving user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      user.refresh_token = refreshToken;

      await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(
        'Error saving refresh token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
