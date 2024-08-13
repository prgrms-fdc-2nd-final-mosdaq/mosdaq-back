import { Module } from '@nestjs/common';
import { MovieDetailService } from './movie-detail.service';
import { MovieDetailController } from './movie-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieDetail } from './entities/movie-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieDetail])],
  controllers: [MovieDetailController],
  providers: [MovieDetailService],
})
export class MovieDetailModule {}
