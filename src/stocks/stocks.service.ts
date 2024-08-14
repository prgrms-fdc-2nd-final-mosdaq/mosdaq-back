import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/poll/entities/movie.entity';
import { Repository } from 'typeorm';
import { StocksModel } from './entities/stocks.entity';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(StocksModel)
    private readonly stockRepository: Repository<StocksModel>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}
  async findMovieByMovieId(movieId: number) {
    const movie = await this.movieRepository.findOne({
      where: { movieId: movieId },
    });

    return movie;
  }
}
