import { Controller, Get } from '@nestjs/common';
import { MainService } from './main.service';

@Controller('api/v1/main-movie')
export class MainController {
  constructor(private mainService: MainService) {}

  @Get('/')
  mainMovie(): string {
    return this.mainService.getMainMovie();
  }
}
