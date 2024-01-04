import { Module } from "@nestjs/common";
import { BuyerService } from "./buyer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocalBuyer } from "./entity/localbuyer.entity";
import { BuyerController } from "./buyer.controller";
import { SocialBuyer } from "./entity/socialbuyer.entity";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "../auth/strategy/google.strategy";
import { KakaoStrategy } from "../auth/strategy/kakao.strategy";
import { Storage } from "@google-cloud/storage";

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalBuyer, SocialBuyer]),
    PassportModule.register({ defaultStrategy: "google", session: true }),
    PassportModule.register({ defaultStrategy: "kakao", session: true }),
  ],
  controllers: [BuyerController],
  providers: [
    BuyerService,
    GoogleStrategy,
    KakaoStrategy,
    {
      provide: Storage,
      useValue: new Storage({
        projectId: process.env.GCP_PROJECTNAME,
        keyFilename: process.env.GCP_KEYFILENAME,
      }),
    },
  ],
  exports: [TypeOrmModule, BuyerService, Storage],
})
export class BuyerModule {}
