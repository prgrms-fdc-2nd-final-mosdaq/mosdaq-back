import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksModel } from './entities/stocks.entity';
import { Movie } from 'src/poll/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StocksModel, Movie])],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
