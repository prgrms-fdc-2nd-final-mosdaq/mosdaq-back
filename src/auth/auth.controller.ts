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
import { Response } from '@nestjs/common';
import { RefreshAuthTokenDto } from './dto/refreshAuthToken.dto';
import { AccessTokenGuard } from './accessToken.guard';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthDto } from './dto/googleOAuth.dto';
import { GoogleAuthGuard } from './auth.guard';
import { Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private oauthClient: OAuth2Client;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.oauthClient = new OAuth2Client(clientId);
  }
  /*
  // 백엔드 api 설계 중 토큰이 필요할 때 사용
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
*/

  /*
  @Post('google')
  ->  구글 OAuth 로그인 프론트 엔드 엔드포인트
   백엔드 테스트 시 주석처리
  */
  @Post('google')
  @UsePipes(new ValidationPipe())
  async googleAuthRedirect(
    @Body() googleOAuthDto: GoogleOAuthDto,
    @Response() res,
  ) {
    const payload =
      await this.authService.validateGoogleOAuthDto(googleOAuthDto);

    const user = await this.authService.findUserByEmailOrSave(
      payload.email,
      payload.family_name + payload.given_name,
      payload.sub,
    );

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
