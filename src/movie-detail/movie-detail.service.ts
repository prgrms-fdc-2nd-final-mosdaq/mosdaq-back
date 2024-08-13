import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieDetail } from './entities/movie-detail.entity';
import { Repository } from 'typeorm';
import { MovieDetailDto } from './dto/movie-detail.dto';

@Injectable()
export class MovieDetailService {
  constructor(
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
  ) {}

  async getMovieDetailById(movieId: number): Promise<MovieDetailDto> {
    try {
      const detail = await this.movieDetailRepository.findOne({
        where: {
          movieId: movieId,
        },
      });

      if (!detail) {
        // 영화가 존재하지 않는 경우, 적절한 예외를 던질 수 있습니다.
        throw new NotFoundException(`Movie with ID ${movieId} not found`);
      }
      const {
        movieTitle,
        movieDirector,
        movieOpenDate,
        movieDescription,
        moviePoster,
      } = detail;

      const response = {
        movieTitle,
        movieDirector,
        movieOpenDate,
        movieDescription,
        moviePoster: moviePoster.split('|'),
      };
      return response;
    } catch (err) {
      console.error('Error fetching main movies:', err);
      throw new HttpException(
        '영화 상세 정보를 가져오는데 실패했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
