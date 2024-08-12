import { Controller, Get, Param, Delete } from '@nestjs/common';
import { MovieListService } from './movie-list.service';
// import { CreateMovieListDto } from './dto/create-movie-list.dto';

@Controller('movie-list')
export class MovieListController {
  constructor(private readonly movieListService: MovieListService) {}

  // @Post()
  // create(@Body() createMovieListDto: CreateMovieListDto) {
  //   return this.movieListService.create(createMovieListDto);
  // }

  @Get()
  findAll() {
    return this.movieListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieListService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieListService.remove(+id);
  }
}
