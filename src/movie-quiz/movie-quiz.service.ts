import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieQuiz } from './entities/movie-quiz.entity';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { GetMovieQuizDto } from './dto/get-movie-quiz.dto';
import { MovieQuizDto } from './dto/movie-quiz.dto';

@Injectable()
export class MovieQuizService {
  constructor(
    @InjectRepository(MovieQuiz)
    private readonly movieQuizRepository: Repository<MovieQuiz>,
  ) {}

  async getRandomMovieQuiz(dto: GetMovieQuizDto): Promise<MovieQuizDto[]> {
    const currentDate = dayjs().format('YYYY-MM-DD');

    const quizzes = await this.movieQuizRepository
      .createQueryBuilder('movie_stock')
      .innerJoin('movie', 'movie', 'movie.movie_id = movie_stock.fk_movie_id')
      .select([
        'movie.movie_id',
        'movie.movie_title',
        'movie.movie_poster',
        'movie_stock.four_weeks_before_price',
        'movie_stock.four_weeks_after_price',
      ])
      .where("movie.movie_open_date <= CURRENT_DATE - INTERVAL '30 days'")
      .orderBy('RANDOM()')
      .limit(dto.count)
      .getRawMany();
    return quizzes.map((quiz) => ({
      movieTitle: quiz.movie_title,
      moviePoster: quiz.movie_poster,
      fourWeeksBeforePrice: +quiz.four_weeks_before_price,
      fourWeeksAfterPrice: +quiz.four_weeks_after_price,
    }));
  }
}
