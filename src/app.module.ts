import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./member/user/user.module";
import { LikeService } from './like/like.service';
import { LikeController } from './like/like.controller';
import { LikeModule } from './like/like.module';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { SellerService } from './seller/seller.service';
import { SellerController } from './seller/seller.controller';
import { SellerModule } from './seller/seller.module';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { ReviewService } from './review/review.service';
import { ReviewController } from './review/review.controller';
import { ReviewModule } from './review/review.module';
import { ItemService } from './item/item.service';
import { ItemController } from './item/item.controller';
import { ItemModule } from './item/item.module';
import { AuthController } from './member/auth/auth.controller';
import { EmailService } from './member/email/email.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    UserModule,
    LikeModule,
    CartModule,
    SellerModule,
    OrderModule,
    ReviewModule,
    ItemModule,
  ],
  providers: [LikeService, CartService, SellerService, OrderService, ReviewService, ItemService, EmailService],
  controllers: [LikeController, CartController, SellerController, OrderController, ReviewController, ItemController, AuthController],
})
export class AppModule {}
