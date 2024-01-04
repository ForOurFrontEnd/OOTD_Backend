import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ItemService } from "./item.service";
import { Item } from "./entity/item.entity";

@Controller("item")
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get("/:category")
  async getItemsByCategory(@Param("category") category: string) {
    const items = await this.itemService.getItemsByCategory(category);
    return { category, items };
  }

  @Get("/:id")
  async getItemsByDetail(@Param("id") id: number) {
    const items = await this.itemService.getItemsByDetail(id);
    return { items };
  }

  @Get("/popularity")
  async getItemsBypopularity() {
    const items = await this.itemService.getItemsByPopularity();
    return { items };
  }

  @Get("/discount")
  async getItemsByDiscount() {
    const items = await this.itemService.getItemsByDiscount();
    return { items };
  }

  @Get("/point")
  async getItemsByPoint() {
    const items = await this.itemService.getItemsByPoint();
    return { items };
  }

  @Post()
  async create(@Body() itemData: Partial<Item>): Promise<Item> {
    return this.itemService.create(itemData);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() itemData: Partial<Item>
  ): Promise<Item> {
    return this.itemService.update(+id, itemData);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    return this.itemService.remove(+id);
  }
}
