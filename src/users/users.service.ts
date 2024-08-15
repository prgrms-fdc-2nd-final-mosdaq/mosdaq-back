import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { PollMovieListResponseDto } from 'src/movie-list/dto/poll-movie-list-response.dto';
import {
  PollResult,
  UserPollMovieListResponseDto,
} from './dto/user-poll-movie-list-response.dto';

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

  // (true, year, userId)
  async getUserPollingMovies(
    poll: boolean,
    year: number,
    userId: number,
  ): Promise<UserPollMovieListResponseDto> {
    console.log(poll);
    console.log(year);
    console.log(userId);

    return {
      movieList: [
        {
          movieId: 1,
          movieTitle: 'Inception',
          posterUrl: [
            'https://example.com/poster1.jpg',
            'https://example.com/poster2.jpg',
          ],
          up: 12,
          down: 45,
          pollResult: PollResult.UP,
        },
        {
          movieId: 2,
          movieTitle: 'The Matrix',
          posterUrl: [
            'https://example.com/matrix1.jpg',
            'https://example.com/matrix2.jpg',
          ],
          up: 9,
          down: 12,
          pollResult: PollResult.DOWN,
        },
        {
          movieId: 3,
          movieTitle: 'Interstellar',
          posterUrl: [
            'https://example.com/interstellar1.jpg',
            'https://example.com/interstellar2.jpg',
          ],
          up: 23,
          down: 2,
          pollResult: PollResult.NONE,
        },
      ],
      movieListCount: 3,
      pagination: {
        currentPage: 1,
        totalPages: 1,
      },
    };
  }

  async getUserPolledMovies(
    poll: boolean,
    year: number,
    userId: number,
  ): Promise<UserPollMovieListResponseDto> {
    console.log(poll);
    console.log(year);
    console.log(userId);

    return {
      movieList: [
        {
          movieId: 1,
          movieTitle: 'Inception',
          posterUrl: [
            'https://example.com/poster1.jpg',
            'https://example.com/poster2.jpg',
          ],
          up: 120,
          down: 45,
          pollResult: PollResult.UP,
          countryCode: 'US',
          beforePrice: 15.99,
          beforePriceDate: '2024-08-14',
          afterPrice: 17.99,
          afterPriceDate: '2024-08-15',
        },
        {
          movieId: 2,
          movieTitle: 'The Matrix',
          posterUrl: [
            'https://example.com/matrix1.jpg',
            'https://example.com/matrix2.jpg',
          ],
          up: 90,
          down: 30,
          pollResult: PollResult.DOWN,
          countryCode: 'US',
          beforePrice: 13.5,
          beforePriceDate: '2024-08-14',
          afterPrice: 12.99,
          afterPriceDate: '2024-08-15',
        },
        {
          movieId: 3,
          movieTitle: 'Interstellar',
          posterUrl: [
            'https://example.com/interstellar1.jpg',
            'https://example.com/interstellar2.jpg',
          ],
          up: 200,
          down: 60,
          pollResult: PollResult.NONE,
          countryCode: 'US',
          beforePrice: 20.0,
          beforePriceDate: '2024-08-14',
          afterPrice: 21.0,
          afterPriceDate: '2024-08-15',
        },
      ],
      movieListCount: 3,
      pagination: {
        currentPage: 1,
        totalPages: 1,
      },
    };
  }
}
