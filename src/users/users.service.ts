// src\users\users.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository, SelectQueryBuilder } from 'typeorm';
import {
  PollResult,
  UserPollMovieListResponseDto,
} from './dto/user-poll-movie-list-response.dto';
import { Movie } from 'src/poll/entities/movie.entity';
import { Company } from 'src/stocks/entities/company.entity';
import { UserPollMovieParamDto } from './dto/user-poll-movie-list-parameter.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findUserByEmailOrSave(
    email: string,
    name: string,
    providerId: string,
    picture: string,
  ): Promise<UsersModel> {
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
        picture,
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

  async findUserById(userId: number): Promise<UsersModel> {
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

  async getUserPollMovies(
    userPollMovieParamDto: UserPollMovieParamDto,
  ): Promise<UserPollMovieListResponseDto> {
    const { poll, year, offset, limit, sort, userId } = userPollMovieParamDto;

    // // year 값이 YYYY 형식인지 확인
    // if (!/^\d{4}$/.test(year.toString())) {
    //   throw new BadRequestException('Year must be in YYYY format');
    // }

    // poll 값에 따라 부등호 설정
    const dateComparison = poll ? '>' : '<';

    // 사용자 투표가 있는 영화들만 선택
    const query: SelectQueryBuilder<Movie> = this.movieRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.polls', 'p', 'p.fk_user_id = :userId', { userId })
      .where('EXTRACT(YEAR FROM m.movie_open_date) = :year', { year })
      .andWhere(`m.movie_open_date ${dateComparison} CURRENT_DATE`)
      .andWhere(`p.fk_user_id = :userId`)
      .select([
        'm.movie_id AS "movieId"',
        'm.movie_title AS "movieTitle"',
        'm.movie_poster AS "posterUrl"',
        `(SELECT COUNT(*) FROM poll p WHERE p.fk_movie_id = m.movie_id AND p.poll_flag = true) AS "up"`,
        `(SELECT COUNT(*) FROM poll p WHERE p.fk_movie_id = m.movie_id AND p.poll_flag = false) AS "down"`,
        `(
          SELECT CASE WHEN p.poll_flag = true THEN 'up' ELSE 'down' END
          FROM poll p
          WHERE p.fk_movie_id = m.movie_id AND p.fk_user_id = :userId
        ) AS "pollResult"`,
      ])
      .groupBy('m.movie_id')
      .orderBy('m.movie_id', sort)
      .offset(offset)
      .limit(limit);

    // 쿼리 실행
    const movies = await query.getRawMany();

    // 페이지네이션 계산
    const totalMoviesCount = await this.movieRepository
      .createQueryBuilder('m')
      .leftJoin('m.polls', 'p', 'p.fk_user_id = :userId', { userId })
      .where('EXTRACT(YEAR FROM m.movie_open_date) = :year', { year })
      .andWhere(`m.movie_open_date ${dateComparison} CURRENT_DATE`)
      .getCount();

    /** TODO: 페이지 네이션
     * 1. 페이지 계산 이상한 부분 처리, 검색 결과가 없는데 currentPage가 totalPage보다 1 더 많은 이유
     * 2. 요청에서 마지막 페이지를 요청할 떄라거나 엣지 케이스인 경우의 처리
     */
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalMoviesCount / limit);

    return {
      movieList: movies.map((movie) => ({
        movieId: Number(movie.movieId),
        movieTitle: movie.movieTitle,
        posterUrl: movie.posterUrl.split('|'),
        up: Number(movie.up),
        down: Number(movie.down),
        pollResult: movie.pollResult,
      })),
      movieListCount: movies.length,
      pagination: {
        currentPage,
        totalPages,
      },
    };
  }
}
