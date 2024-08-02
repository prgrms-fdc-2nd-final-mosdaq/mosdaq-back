import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MainMovieView } from './entities/main-movie-view.entity';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(MainMovieView)
    private mainMovieRepository: Repository<MainMovieView>,
  ) {}

  async getMainMovies(): Promise<any> {
    const movieList = await this.mainMovieRepository.find();
    return {
      movieList: movieList.map((movie) => ({
        movieId: movie.movie_id,
        movieTitle: movie.movie_title,
        posterUrl: movie.movie_poster,
        countryCode: movie.country_code,
        beforePrice: movie.before_price,
        afterPrice: movie.after_price,
        beforePriceDate: movie.before_date,
        afterPriceDate: movie.after_date,
      })),
      movieListCount: movieList.length,
    };
  }
}
