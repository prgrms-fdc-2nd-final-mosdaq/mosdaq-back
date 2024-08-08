import { Module } from '@nestjs/common';
import { MovieDetailService } from './movie-detail.service';
import { MovieDetailController } from './movie-detail.controller';

@Module({
  controllers: [MovieDetailController],
  providers: [MovieDetailService],
})
export class MovieDetailModule {}
