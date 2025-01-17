import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// ❶ google 스트래티지 사용
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: any): Promise<boolean> {
    // ❷ 부모 클래스의 메서드 사용
    const result = (await super.canActivate(context)) as boolean;
    // ❸ 컨텍스트에서 리퀘스트 객체를 꺼냄
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}
