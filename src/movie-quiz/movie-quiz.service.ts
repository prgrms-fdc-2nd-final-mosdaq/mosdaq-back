import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieQuiz } from './entities/movie-quiz.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MovieQuizService {
  constructor(
    @InjectRepository(MovieQuiz)
    private readonly movieQuizRepository: Repository<MovieQuiz>,
  ) {}

  async getRandomMovieQuiz(limit: number): Promise<MovieQuiz[]> {
    return this.movieQuizRepository
      .createQueryBuilder('movie_stock')
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();
  }
}
