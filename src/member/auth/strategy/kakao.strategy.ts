import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import { VerifyCallback } from "jsonwebtoken";
import { UserService } from "src/member/user/user.service";
import { User } from 'src/member/user/entity/user.entity';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_REDIRECT_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const { _json } = profile;
    const email = _json.kakao_account.email;
    const photo = _json.properties.profile_image;
    const name = _json.properties.nickname;
    const isAutoLogin = true

    try {
      const user: User = await this.userService.findByEmailOrSave(
        email,
        photo,
        name,
        isAutoLogin
      );

      const payload = { user: { email: user.email }};
      done(null, payload);
    } catch (error) {
      done(error, false);
    }
  }
}
