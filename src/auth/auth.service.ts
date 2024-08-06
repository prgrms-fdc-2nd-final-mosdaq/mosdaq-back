import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthDto } from './dto/googleOAuth.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private oauthClient: OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.oauthClient = new OAuth2Client(clientId);
  }

  async findUserByEmailOrSave(email: string, name: string, providerId: string) {
    try {
      const user = await this.usersService.findUserByEmailOrSave(
        email,
        name,
        providerId,
      );

      return user;
    } catch {}
  }

  async validateGoogleOAuthDto(googleOAuthDto: GoogleOAuthDto) {
    try {
      const { token } = googleOAuthDto;

      // Google 토큰 검증
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      return ticket.getPayload();
    } catch {
      // TODO:
      console.log('error while verify googleOAuthDto');
      throw new BadRequestException();
    }
  }

  async getTokens(user: UsersModel) {
    const accessToken = this.assignJwtToken(user, false);
    const refreshToken = this.assignJwtToken(user, true);
    await this.usersService.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAndGetNewTokens(refreshToken: string, userId: number) {
    const user = await this.usersService.findUserById(userId);
    if (user.refresh_token !== refreshToken)
      throw new UnauthorizedException(
        '유효하지 않은 토큰입니다. 다시 로그인 하십시오.',
      );

    const isExpired = await this.isTokenExpired(refreshToken);
    if (isExpired) {
      throw new UnauthorizedException(
        '유효하지 않은 토큰입니다. 다시 로그인 하십시오.',
      );
    }

    return this.getTokens(user);
  }

  assignJwtToken(
    user: Pick<UsersModel, 'email' | 'id'>,
    isRefreshToken: boolean,
  ) {
    try {
      const expiresIn = isRefreshToken
        ? this.configService.get<string>('REFRESH_TOKEN_EXPIRATION')
        : this.configService.get<string>('ACCESS_TOKEN_EXPIRATION');

      return this.jwtService.sign(
        {
          email: user.email,
          sub: user.id,
          type: isRefreshToken ? 'refreshToken' : 'accessToken',
        },
        { expiresIn: expiresIn },
      );
    } catch {
      // TODO:
      console.log('Error while assign token');
      throw new BadRequestException();
    }
  }

  async isTokenExpired(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      // 현재 시간과 비교
      return payload.exp < Math.floor(Date.now() / 1000) ? true : false;
    } catch {
      // TODO:
      console.log('Error while checking token expired');
      throw new BadRequestException();
    }
  }

  async getUserIdFromToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      // user_id 반환
      return payload.sub;
    } catch (error) {
      // TODO:
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(
          '유효하지 않은 토큰입니다. 다시 로그인 하십시오.',
        );
      } else {
        throw new UnauthorizedException(
          '토큰 검증 중 오류가 발생했습니다. 다시 시도하십시오.',
        );
      }
    }
  }

  async logout(userId: number) {
    try {
      await this.usersService.deleteRefreshToken(userId);
    } catch {
      // TODO:
      console.log('Error while logout');
      throw new BadRequestException();
    }
  }
}