import { Injectable } from '@nestjs/common';
// import { CreateMovieListDto } from './dto/create-movie-list.dto';
// import { UpdateMovieListDto } from './dto/update-movie-list.dto';

@Injectable()
export class MovieListService {
  // create(createMovieListDto: CreateMovieListDto) {
  //   return 'This action adds a new movieList';
  // }

  findAll() {
    return `This action returns all movieList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movieList`;
  }

  // update(id: number, updateMovieListDto: UpdateMovieListDto) {
  //   return `This action updates a #${id} movieList`;
  // }

  remove(id: number) {
    return `This action removes a #${id} movieList`;
  }
}
