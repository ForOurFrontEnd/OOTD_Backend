import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { Search } from "./entity/search.entity";
import { Item } from "../item/entity/item.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemModule } from "../item/item.module";

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [TypeOrmModule.forFeature([Item, Search])],
})
export class SearchModule {}
