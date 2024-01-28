import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/member/user/entity/user.entity';
import { Item } from 'src/item/entity/item.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) { }

    async buyOrder(userId: string, itemId: number, quantity: number, size: string): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { u_id: userId } });
            const item = await this.itemRepository.findOne({ where: { i_id: itemId } });

            if (!user || !item) {
                throw new Error('사용자 또는 아이템을 찾을 수 없습니다.');
            }

            const newOrder = new Order();
            newOrder.user = user;
            newOrder.item = item;
            newOrder.size = size;
            newOrder.quantity = quantity;

            const savedOrder = await this.orderRepository.save(newOrder);

            return {
                message: '구매 요청이 성공적으로 저장되었습니다.',
                success: true,
                like: savedOrder,
            };
        } catch (error) {
            console.error("buyOrder Error:", error);
            throw new Error('구매 중 오류가 발생했습니다.');
        }
    }

    async cancelOrder(orderId: number): Promise<any> {
        try {
            if (orderId == null) {
                throw new Error('주문을 찾을 수 없습니다.');
            }

            const order = await this.orderRepository.findOne({ where: { o_id: orderId } })
            if (order.state === "배송준비중") {
                await this.orderRepository.delete(orderId)
                return {
                    message: '주문이 성공적으로 취소되었습니다.',
                    success: true,
                }
            }else {
                return {
                    message: '상품이 배송중이라 취소할수없습니다.',
                    success: false,
                }
            }
            
        } catch (error) {
            console.error("cancelOrder Error:", error);
            throw new Error('주문 취소 중 오류가 발생했습니다.');
        }
    }

}
