import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, Profile } from "passport-google-oauth20";
import { UserService } from "src/member/user/user.service";
import { sign } from "jsonwebtoken";
import { User } from 'src/member/user/entity/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ["email", "profile"],
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: "offline",
      prompt: "select_account",
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<any> {
    console.log(profile);

    const { emails, photos, displayName } = profile;
    const email = emails[0].value;
    const photo = photos[0].value;
    const name = displayName;
    const isAutoLogin = true;

    try {
      const user: User = await this.userService.findByEmailOrSave(
        email,
        photo,
        name,
        isAutoLogin
      );

      const payload = { user: { email: user.email }, type: "buyer" };
      done(null, payload);
    } catch (error) {
      done(error, false);
    }
  }
}
