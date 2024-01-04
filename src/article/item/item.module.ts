import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "./entity/item.entity";

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [TypeOrmModule.forFeature([Item])],
})
export class ItemModule {}
