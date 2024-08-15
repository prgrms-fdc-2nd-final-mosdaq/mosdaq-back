import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Movie } from 'src/poll/entities/movie.entity';
import { Company } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Movie, Company])],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
