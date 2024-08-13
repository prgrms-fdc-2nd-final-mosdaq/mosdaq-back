import { Injectable } from '@nestjs/common';
import { PollingMovieListDto } from './dto/polling-movie-list-response.dto';

@Injectable()
export class MovieListService {
  async getPollingMovies(
    offset: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    userId: number | null = null,
  ): Promise<PollingMovieListDto> {
    console.log('offset : ', offset);
    console.log('limit : ', limit);
    console.log('sort : ', sort);
    console.log('userId : ', userId);

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
