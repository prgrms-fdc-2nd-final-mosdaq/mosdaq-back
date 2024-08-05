import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MainMovieView } from './entities/main-movie-view.entity';
import { PopularPollingMovieView } from './entities/popular-polling-movie-view.entity'; // 추가

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(MainMovieView)
    private mainMovieRepository: Repository<MainMovieView>,
    @InjectRepository(PopularPollingMovieView)
    private popularPollingMovieRepository: Repository<PopularPollingMovieView>, // 추가
  ) {}

  async getMainMovies(): Promise<any> {
    const movieList = await this.mainMovieRepository.find();
    return {
      movieList: movieList.map((movie) => ({
        movieId: movie.movie_id,
        movieTitle: movie.movie_title,
        posterUrl: movie.movie_poster,
        countryCode: movie.country,
        beforePrice: movie.before_price,
        afterPrice: movie.after_price,
        beforePriceDate: movie.before_date,
        afterPriceDate: movie.after_date,
      })),
      movieListCount: movieList.length,
    };
  }

  async getPopularPollingMovies(): Promise<any> {
    // 추가
    const movieList = await this.popularPollingMovieRepository.find();
    const upVotes = movieList.filter((movie) => movie.pollFlag === 'up').length;
    const downVotes = movieList.filter(
      (movie) => movie.pollFlag === 'down',
    ).length;
    const totalVotes = upVotes + downVotes;
    return {
      movieList: movieList.map((movie) => ({
        movieId: movie.movieId,
        movieTitle: movie.movieTitle,
        posterUrl: movie.moviePoster,
        up: (upVotes / totalVotes) * 100,
        down: (downVotes / totalVotes) * 100,
      })),
      movieListCount: movieList.length,
    };
  }
}
