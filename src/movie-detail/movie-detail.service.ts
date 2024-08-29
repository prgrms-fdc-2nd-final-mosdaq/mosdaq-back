import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieDetailDto } from './dto/movie-detail.dto';
import { Movie } from 'src/poll/entities/movie.entity';
import { matchTickerToCompanyName } from 'src/util/company';

@Injectable()
export class MovieDetailService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieDetailRepository: Repository<Movie>,
  ) {}

  async getMovieDetailById(movieId: number): Promise<MovieDetailDto> {
    try {
      const detail = await this.movieDetailRepository.findOne({
        where: {
          movieId: movieId,
        },
        relations: ['company'],
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
        company,
      } = detail;

      const response = {
        movieTitle,
        movieDirector,
        movieOpenDate,
        movieDescription,
        posterUrl: moviePoster.split('|'),
        companyName: matchTickerToCompanyName(company.tickerName),
      };
      return response;
    } catch (error) {
      console.error('Error fetching main movies:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        '영화 상세 정보를 가져오는데 실패했습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
