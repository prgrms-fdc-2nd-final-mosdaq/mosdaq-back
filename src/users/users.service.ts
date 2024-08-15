// src\users\users.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import {
  PollResult,
  UserPollMovieListResponseDto,
} from './dto/user-poll-movie-list-response.dto';
import { Movie } from 'src/poll/entities/movie.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    // @InjectRepository(Stock)
    // private readonly stockRepository: Repository<Stock>,

    // @InjectRepository(Company)
    // private readonly companyRepository: Repository<Company>,
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

  async getUserPollingMovies(
    poll: boolean,
    year: number,
    offset: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    userId: number,
  ): Promise<UserPollMovieListResponseDto> {
    console.log(poll);
    console.log(year);
    console.log(offset);
    console.log(limit);
    console.log(sort);
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
    offset: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    userId: number | null,
  ): Promise<UserPollMovieListResponseDto> {
    const query = this.movieRepository
      .createQueryBuilder('m')
      .select([
        'm.movie_id AS "movieId"',
        'm.movie_title AS "movieTitle"',
        'array_agg(m.movie_poster) AS "posterUrl"',
        `(SELECT COUNT(*) FROM poll p WHERE p.fk_movie_id = m.movie_id AND p.poll_flag = true) AS "up"`,
        `(SELECT COUNT(*) FROM poll p WHERE p.fk_movie_id = m.movie_id AND p.poll_flag = false) AS "down"`,
        `COALESCE((
          SELECT CASE WHEN p.poll_flag = true THEN 'up' ELSE 'down' END
          FROM poll p
          WHERE p.fk_movie_id = m.movie_id AND p.fk_user_id = :userId
        ), NULL) AS "pollResult"`,
        'c.country AS "countryCode"',
        'c.company_name AS "companyName"',
        'bs.close_price AS "beforePrice"',
        'bs.stock_date AS "beforePriceDate"',
        'as.close_price AS "afterPrice"',
        'as.stock_date AS "afterPriceDate"',
      ])
      .leftJoin('company', 'c', 'm.fk_company_id = c.company_cd')
      .leftJoin(
        'stock',
        'bs',
        'bs.ticker_name = c.ticker_name AND bs.stock_date = (SELECT MAX(stock_date) FROM stock WHERE ticker_name = c.ticker_name AND stock_date < CURRENT_DATE)',
      )
      .leftJoin(
        'stock',
        'as',
        'as.ticker_name = c.ticker_name AND as.stock_date = CURRENT_DATE',
      )
      .where('EXTRACT(YEAR FROM m.movie_open_date) = :year', { year })
      .andWhere('m.movie_open_date < CURRENT_DATE')
      .groupBy(
        'm.movie_id, c.country, c.company_name, bs.close_price, bs.stock_date, as.close_price, as.stock_date',
      )
      .orderBy('m.movie_id', sort)
      .offset(offset)
      .limit(limit)
      .setParameter('userId', userId)
      .getRawMany();

    const movies = await query;

    return {
      movieList: movies.map((movie) => ({
        movieId: movie.movieId,
        movieTitle: movie.movieTitle,
        posterUrl: movie.posterUrl,
        up: Number(movie.up),
        down: Number(movie.down),
        pollResult: movie.pollResult,
        countryCode: movie.countryCode || undefined,
        companyName: movie.companyName || undefined,
        beforePrice: parseFloat(movie.beforePrice) || undefined,
        beforePriceDate: movie.beforePriceDate || undefined,
        afterPrice: parseFloat(movie.afterPrice) || undefined,
        afterPriceDate: movie.afterPriceDate || undefined,
      })),
      movieListCount: movies.length,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(movies.length / limit),
      },
    };
  }

  /*
  async getUserPolledMovies(
    poll: boolean,
    year: number,
    offset: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    userId: number | null,
  ): Promise<UserPollMovieListResponseDto> {
    const query = `
      SELECT 
        m.movie_id AS "movieId",
        m.movie_title AS "movieTitle",
        array_agg(m.movie_poster) AS "posterUrl",
        (SELECT COUNT(*) FROM poll p WHERE p.fk_movie_id = m.movie_id AND p.poll_flag = true) AS "up",
        (SELECT COUNT(*) FROM poll p WHERE p.fk_movie_id = m.movie_id AND p.poll_flag = false) AS "down",
        COALESCE((
          SELECT p.poll_flag
          FROM poll p
          WHERE p.fk_movie_id = m.movie_id AND p.fk_user_id = $1
        ), NULL) AS "pollResult"
      FROM 
        movie m
      LEFT JOIN 
        poll p ON p.fk_movie_id = m.movie_id
      WHERE 
        EXTRACT(YEAR FROM m.movie_open_date) = $2
        AND m.movie_open_date < CURRENT_DATE
      GROUP BY 
        m.movie_id
      ORDER BY 
        m.movie_open_date ${sort}
      OFFSET $3
      LIMIT $4;
    `;

    const movies = await this.movieRepository.query(query, [
      userId,
      year,
      offset,
      limit,
    ]);

    return {
      movieList: movies.map((movie) => ({
        movieId: movie.movieId,
        movieTitle: movie.movieTitle,
        posterUrl: movie.posterUrl,
        up: Number(movie.up),
        down: Number(movie.down),
        pollResult:
          movie.pollResult === true
            ? PollResult.UP
            : movie.pollResult === false
              ? PollResult.DOWN
              : PollResult.NONE,
      })),
      movieListCount: movies.length,
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(movies.length / limit),
      },
    };
  }
  */
}
