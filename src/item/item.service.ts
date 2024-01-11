import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entity/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) { }

    async itemView(id: number) {
        const item = await this.itemRepository.findOne({ where: { i_id: id } })
        if (item) {
            return item
        } else {
            return "잘못된 요청입니다."
        }
    }
}
