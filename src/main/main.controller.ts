import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class MainController {
  @Get('main-movie')
  mainMovie(): string {
    return 'main-movie';
  }
}
