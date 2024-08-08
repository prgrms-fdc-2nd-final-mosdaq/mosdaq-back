import { Injectable } from '@nestjs/common';
import { CreateMovieDetailDto } from './dto/create-movie-detail.dto';
import { UpdateMovieDetailDto } from './dto/update-movie-detail.dto';

@Injectable()
export class MovieDetailService {
  create(createMovieDetailDto: CreateMovieDetailDto) {
    return 'This action adds a new movieDetail';
  }

  findAll() {
    return `This action returns all movieDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movieDetail`;
  }

  update(id: number, updateMovieDetailDto: UpdateMovieDetailDto) {
    return `This action updates a #${id} movieDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} movieDetail`;
  }
}
