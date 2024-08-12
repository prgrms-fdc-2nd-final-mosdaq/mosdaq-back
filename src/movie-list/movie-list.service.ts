import { Injectable } from '@nestjs/common';
import { PollingMovieListDto } from './dto/polling-movie-list-response.dto';

@Injectable()
export class MovieListService {
  async getPollingMovies(): Promise<PollingMovieListDto> {
    return {
      movieList: [
        {
          movieId: 0,
          movieTitle: 'parasite',
          posterUrl: ['some', 'someblah'],
          up: 0,
          down: 0,
          myPollResult: null,
        },
      ],
      movieListCount: 0,
      pagination: 0,
    };
  }
}
