import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entity/item.entity';
import { Repository } from 'typeorm';
import { Like } from 'src/like/entity/like.entity';

type RankData = {
    i_id: number,
    count: number,
    category: string,
    photo: string,
    title: string,
    price: number,
    brand: string,
    discount: number
}

type DiscountData = {
    i_id: number,
    category: string,
    photo: string,
    title: string,
    price: number,
    brand: string,
    discount: number
}

type PointData = {
    i_id: number,
    category: string,
    photo: string,
    title: string,
    price: number,
    brand: string,
    discount: number
}
@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Like)
        private likeRepository: Repository<Like>
    ) { }

    async itemPopularRank(): Promise<RankData[]> {
        const popularRank = await this.likeRepository.find({ relations: ['item'] });

        const itemCounts = popularRank.reduce((acc, like) => {
            const { i_id, category, photo, title, price, brand, discount } = like.item;
            if (acc[i_id]) {
                acc[i_id].count++;
            } else {
                acc[i_id] = { i_id, count: 1, category, photo, title, price, brand, discount };
            }
            return acc;
        }, []);

        const itemCountsArray = Object.entries(itemCounts).map(([i_id, data]) => data);
        itemCountsArray.sort((a, b) => b.count - a.count);

        const top9Items = itemCountsArray.slice(0, 9);
        return top9Items;
    }

    async itemDiscountRank(): Promise<DiscountData[]> {
        const items = await this.itemRepository.find();

        const sortedItems = items.sort((a, b) => {
            const discountA = Number(Math.floor(a.discount)) || 0;
            const discountB = Number(Math.floor(b.discount)) || 0;

            return discountB - discountA;
        });
        
        const top9Items = sortedItems.slice(0,9)
        return top9Items;
    }

    async itemPointRank(): Promise<PointData[]> {
        const items = await this.itemRepository.find();

        const sortedItems = items.sort((a, b) => {
            const pointA = Number(Math.floor(a.point)) || 0;
            const pointB = Number(Math.floor(b.point)) || 0;

            return pointB - pointA;
        });

        const top9Items = sortedItems.slice(0,9)
        return top9Items;
    }

    async itemView(id: number) {
        const item = await this.itemRepository.findOne({ where: { i_id: id } })
        if (item) {
            return item
        } else {
            return "잘못된 요청입니다."
        }
    }

    async categoryView(category:string) {
        const item = await this.itemRepository.find({ where: { category } })
        if (item) {
            return item
        } else {
            return "잘못된 요청입니다."
        }
    }

    async categoryPage(category:string, page:number) {
        const item = await this.itemRepository.find({ where: { category } })
        if (item) {
            const PageList = item.slice(0 + 20*page,20 + 20*page)
            return PageList
        } else {
            return "잘못된 요청입니다."
        }
    }
}
