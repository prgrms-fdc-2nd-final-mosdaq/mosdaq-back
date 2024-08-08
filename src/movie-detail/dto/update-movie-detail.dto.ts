import { PartialType } from '@nestjs/swagger';
import { CreateMovieDetailDto } from './create-movie-detail.dto';

export class UpdateMovieDetailDto extends PartialType(CreateMovieDetailDto) {}
