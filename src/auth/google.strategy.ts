import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

interface ExtendedProfile extends Profile {
  picture: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'), // 클라이언트 ID
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'), // 시크릿
      callbackURL: configService.get<string>('GOOGLE_STRATEGY_CALLBACK_URL'), // 콜백 URL
      scope: ['email', 'profile'], // scope
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: ExtendedProfile,
  ) {
    const { id, name, emails, picture } = profile;

    const providerId = id;
    const email = emails[0].value;

    const user: UsersModel = await this.userService.findUserByEmailOrSave(
      email,
      name.familyName + name.givenName,
      providerId,
      picture,
    );

    return user;
  }
}
