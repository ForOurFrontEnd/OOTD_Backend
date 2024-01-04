import { Injectable } from "@nestjs/common";
import { Item } from "./entity/item.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {}

  async getItemsByCategory(category: string): Promise<Item[]> {
    return await this.itemRepository.find({ where: { category } });
  }

  async getItemsByDetail(id: number): Promise<Item | undefined> {
    return await this.itemRepository.findOne({ where: { id } });
  }

  async getItemsByPopularity(): Promise<Item[]> {
    return this.itemRepository.find({
      order: {
        likeCount: "DESC",
      },
    });
  }

  async getItemsByDiscount(): Promise<Item[]> {
    return this.itemRepository.find({
      order: {
        discount: "DESC",
      },
    });
  }

  async getItemsByPoint(): Promise<Item[]> {
    return this.itemRepository.find({
      order: {
        point: "DESC",
      },
    });
  }

  async create(itemData: Partial<Item>): Promise<Item> {
    const newItem = this.itemRepository.create(itemData);
    return await this.itemRepository.save(newItem);
  }

  async update(id: number, itemData: Partial<Item>): Promise<Item> {
    await this.itemRepository.update(id, itemData);
    return await this.itemRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.itemRepository.delete(id);
  }
}
