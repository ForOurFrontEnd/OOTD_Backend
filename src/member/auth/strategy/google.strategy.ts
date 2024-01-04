import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, Profile } from "passport-google-oauth20";
import { SocialBuyer } from "src/member/buyer/entity/socialbuyer.entity";
import { BuyerService } from "src/member/buyer/buyer.service";
import { sign } from "jsonwebtoken";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private buyerService: BuyerService) {
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
    try {
      const user: SocialBuyer = await this.buyerService.findByEmailOrSave(
        email,
        photo,
        name
      );

      const payload = { user: { email: user.email }, type: "socialBuyer" };
      done(null, payload);
    } catch (error) {
      done(error, false);
    }
  }
}
