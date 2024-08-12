import { PartialType } from '@nestjs/swagger';
import { CreateMovieListDto } from './create-movie-list.dto';

export class UpdateMovieListDto extends PartialType(CreateMovieListDto) {}
