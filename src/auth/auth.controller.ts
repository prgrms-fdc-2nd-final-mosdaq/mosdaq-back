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
import { GoogleOAuthDto } from './dto/googleOAuth.dto';
import { GoogleAuthGuard } from './auth.guard';
import { Request } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TokenRefreshResponse } from './dto/tokenRefreshResponse.dto';

@ApiTags('auth 관련')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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

    const myTokens = await this.authService.getTokens(user);
    res.json(myTokens);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'access 토큰 재발급 API',
    description: 'refresh 토큰 검증으로 access 토큰을 재발급 받을 수 있습니다.',
  })
  @ApiCreatedResponse({
    description: '새로운 access 토큰, refresh 토큰 발급',
    type: TokenRefreshResponse,
  })
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
