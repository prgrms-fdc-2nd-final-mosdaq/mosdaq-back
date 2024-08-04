import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenGuard } from './accessToken.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          issuer: configService.get<string>('JWT_ISSUER'), // issuer 추가
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  exports: [AccessTokenGuard, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, AccessTokenGuard],
})
export class AuthModule {}
