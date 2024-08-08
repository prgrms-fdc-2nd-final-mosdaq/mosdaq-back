import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovieDetailService } from './movie-detail.service';
import { CreateMovieDetailDto } from './dto/create-movie-detail.dto';
import { UpdateMovieDetailDto } from './dto/update-movie-detail.dto';

@Controller('movie-detail')
export class MovieDetailController {
  constructor(private readonly movieDetailService: MovieDetailService) {}

  @Post()
  create(@Body() createMovieDetailDto: CreateMovieDetailDto) {
    return this.movieDetailService.create(createMovieDetailDto);
  }

  @Get()
  findAll() {
    return this.movieDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDetailDto: UpdateMovieDetailDto) {
    return this.movieDetailService.update(+id, updateMovieDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieDetailService.remove(+id);
  }
}
