import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/poll/entities/movie.entity';
import { get4WeeksPrevPriceByOpenDate } from 'src/util/date';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  /*
  depreciated
  async findMovieByMovieId(movieId: number) {
    try {
      const movie = await this.movieRepository.findOne({
        where: { movieId: movieId },
      });
      if (!movie) throw new NotFoundException('존재하지 않는 영화 id입니다.');
      return movie;
    } catch (error) {
      console.log('Error while search movie by movieId');
      throw new BadRequestException();
    }
  }

  async findCompanyByCompanyCd(companyCd: string) {
    const company = await this.companyRepository.findOne({
      where: { companyCd: companyCd },
    });

    return company;
  }
*/
  async findCompanyByMovieId(movieId: number) {
    try {
      // 영화 검색
      const movie = await this.movieRepository.findOne({
        where: { movieId: movieId },
      });
      if (!movie) throw new NotFoundException('존재하지 않는 영화 id입니다.');
      console.log(movie.movieOpenDate);
      // 회사 검색
      const company = await this.companyRepository.findOne({
        where: { companyCd: movie.companyId },
      });
      // 가격을 찾는데
      // 없으면 그 전날이나
      // 그 전전날
      const candidateDates = get4WeeksPrevPriceByOpenDate(movie.movieOpenDate);
      console.log(candidateDates);
      const price = await this.stockRepository.find({
        where: {
          tickerName: company.tickerName,
          stockDate: candidateDates[0],
        },
      });
      console.log(price);
      return company;
    } catch (error) {
      console.log('error : ', error);
      console.log('Error while search company by movieId');
      throw new BadRequestException();
    }
  }
}
