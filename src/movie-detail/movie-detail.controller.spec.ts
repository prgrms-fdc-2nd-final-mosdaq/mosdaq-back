import { Test, TestingModule } from '@nestjs/testing';
import { MovieDetailController } from './movie-detail.controller';
import { MovieDetailService } from './movie-detail.service';

describe('MovieDetailController', () => {
  let controller: MovieDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieDetailController],
      providers: [MovieDetailService],
    }).compile();

    controller = module.get<MovieDetailController>(MovieDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
