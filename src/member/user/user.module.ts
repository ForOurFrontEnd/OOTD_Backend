import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "../auth/strategy/google.strategy";
import { KakaoStrategy } from "../auth/strategy/kakao.strategy";
import { User } from './entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: "google", session: true }),
    PassportModule.register({ defaultStrategy: "kakao", session: true }),
  ],
  controllers: [UserController],
  providers: [UserService, GoogleStrategy, KakaoStrategy],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
