import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { RefreshAuthTokenDto } from './dto/refreshAuthToken.dto';
import { AccessTokenGuard } from './accessToken.guard';
import { GoogleOAuthDto } from './dto/googleOAuth.dto';
import { GoogleAuthGuard } from './auth.guard';
import { Request, Response } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokenResponse } from './dto/tokenResponse.dto';

@ApiTags('auth 관련')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 백엔드 api 설계 중 토큰이 필요할 때 사용
  /*
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
  @ApiOperation({
    summary: '구글 OAuth 로그인 API',
    description: '구글 OAuth 로그인을 진행합니다.',
  })
  @ApiCreatedResponse({
    description: 'access 토큰과 refresh 토큰을 발급받습니다.',
    type: TokenResponse,
  })
  @ApiBadRequestResponse({
    description: 'token should not be empty,token must be a string.',
  })
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
  @UsePipes(new ValidationPipe())
  async googleAuthRedirect(
    @Body() googleOAuthDto: GoogleOAuthDto,
  ): Promise<TokenResponse> {
    const payload =
      await this.authService.validateGoogleOAuthDto(googleOAuthDto);
    console.log(payload);
    const user = await this.authService.findUserByEmailOrSave(
      payload.email,
      payload.name,
      payload.sub,
    );

    const myTokens = await this.authService.getTokens(user);
    return myTokens;
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'access 토큰 재발급 API',
    description: 'refresh 토큰 검증으로 access 토큰을 재발급 받을 수 있습니다.',
  })
  @ApiCreatedResponse({
    description: '새로운 access 토큰, refresh 토큰 발급',
    type: TokenResponse,
  })
  @ApiBadRequestResponse({
    description:
      'refreshToken should not be empty,refreshToken must be a string.',
  })
  @ApiForbiddenResponse({
    description: '유효하지 않은 토큰입니다. 다시 로그인 하십시오',
  })
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
  @UsePipes(new ValidationPipe())
  async refreshAuthToken(
    @Body() refreshAuthTokenDto: RefreshAuthTokenDto,
  ): Promise<TokenResponse> {
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
  @ApiOperation({
    summary: '로그아웃 API',
    description: '로그아웃을 진행합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰을 포함한 인증 헤더입니다.',
    required: true,
    example: 'Bearer your_token_here',
  })
  @ApiOkResponse({
    description: '로그아웃 성공',
    schema: {
      example: {
        message: '로그아웃되었습니다.',
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'refreshToken should not be empty,refreshToken must be a string.',
  })
  @ApiUnauthorizedResponse({
    description: '인증 토큰이 없습니다.',
  })
  @ApiForbiddenResponse({
    description: '유효하지 않은 토큰입니다. 다시 로그인 하십시오.',
  })
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
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
