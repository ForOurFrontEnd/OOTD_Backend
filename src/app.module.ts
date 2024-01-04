import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { BuyerModule } from "./member/buyer/buyer.module";
import { SellerModule } from "./member/seller/seller.module";
import { ManagerModule } from "./member/manager/manager.module";
import { LikeModule } from "./interaction/like/like.module";
import { DeliveryModule } from "./circulation/delivery/delivery.module";
import { OrderModule } from "./circulation/order/order.module";
import { CartModule } from "./circulation/cart/cart.module";
import { ReviewModule } from "./interaction/review/review.module";
import { CommentModule } from "./interaction/comment/comment.module";
import { AddressModule } from "./circulation/address/address.module";
import { ManagementModule } from "./management/management.module";
import { ItemModule } from "./article/item/item.module";
import { SearchModule } from "./article/search/search.module";

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
    BuyerModule,
    SellerModule,
    ManagerModule,
    ItemModule,
    ReviewModule,
    CartModule,
    OrderModule,
    DeliveryModule,
    LikeModule,
    CommentModule,
    AddressModule,
    ManagementModule,
    SearchModule,
  ],
})
export class AppModule {}
