import { Module } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { Seller } from "./entity/seller.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SellerController } from "./seller.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Seller])],
  providers: [SellerService],
  controllers: [SellerController],
  exports: [TypeOrmModule, SellerService],
})
export class SellerModule {}
