import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './auth.guard';
import { Request, Response } from '@nestjs/common';
import { RefreshAuthTokenDto } from './dto/refreshAuthToken.dto';
import { AccessTokenGuard } from './accessToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('to-google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const user = req.user;

    const tokens = await this.authService.getTokens(user);

    res.json(tokens);
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe())
  async refreshAuthToken(@Body() refreshAuthTokenDto: RefreshAuthTokenDto) {
    const userId: number = await this.authService.getUserIdFromToken(
      refreshAuthTokenDto.refreshToken,
    );

    const { refreshToken, accessToken } =
      await this.authService.validateAndGetNewTokens(
        refreshAuthTokenDto.refreshToken,
        userId,
      );

    return { accessToken, refreshToken };
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe())
  async logout(@Body() refreshAuthTokenDto: RefreshAuthTokenDto) {
    const userId: number = await this.authService.getUserIdFromToken(
      refreshAuthTokenDto.refreshToken,
    );

    await this.authService.logout(userId);
    return { message: '로그아웃되었습니다.' };
  }
}
