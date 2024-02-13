import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/member/user/entity/user.entity';
import { Item } from 'src/item/entity/item.entity';
import { Cart } from 'src/cart/entity/cart.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
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
                order: savedOrder,
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
            } else {
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

    async getCarts(carts: number[]) {
        const cartArray = [];
        await Promise.all(carts.map(async (item) => {
            const cart = await this.cartRepository.findOne({ where: { c_id: item }, relations: ['item'], });
            cartArray.push(cart);
        }));
        return cartArray
    }

    async getItem(item:number, user:string){
        const cart = await this.cartRepository.find({where:{user:{u_id:user},item:{i_id:item}}, relations: ['item']})
        const itemCart = cart.reduce((maxCart, currentCart) => {
            return currentCart.c_id > maxCart.c_id ? currentCart : maxCart;
          }, cart[0]);
        return [itemCart]
    }

    async pushCartButton(userId: string, itemId: number): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { u_id: userId } });
            const item = await this.itemRepository.findOne({ where: { i_id: itemId } });
    
            if (!user || !item) {
                throw new Error('사용자 또는 아이템을 찾을 수 없습니다.');
            }
    
            const existingLike = await this.cartRepository.findOne({ where: { user: { u_id: userId }, item: { i_id: itemId } } });
            console.log("1",existingLike);
            
            if (existingLike) {
                await this.cartRepository.remove(existingLike);
                return {
                    message: '이미 들어가있는 장바구니',
                    success: true,
                    like: existingLike,
                };
            }
    
            const newCart = new Cart();
            newCart.user = user;
            newCart.item = item;
    
            const savedCart = await this.cartRepository.save(newCart);
            console.log("2",savedCart);
            
            return {
                message: '좋아요가 성공적으로 저장되었습니다.',
                success: true,
                like: savedCart,
            };
        } catch (error) {
            console.error("pushLikeButton Error:", error);
            throw new Error('좋아요 저장 중 오류가 발생했습니다.');
        }
    }
    
}
