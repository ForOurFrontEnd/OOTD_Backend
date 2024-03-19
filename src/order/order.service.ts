import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/member/user/entity/user.entity';
import { Item } from 'src/item/entity/item.entity';
import { Cart } from 'src/cart/entity/cart.entity';
import { verify } from "jsonwebtoken";
import { OrderState } from './entity/order-state.enum';

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

    async decodeToken(cookie: string) {
        try {
            const token = cookie.split('Authorization=Bearer%20')[1];
            const decodeToken = verify(
                token,
                process.env.ACCESS_TOKEN_PRIVATE_KEY
            )
            return decodeToken;
        } catch (e) {
            console.error("decodeToken Error:", e);
            return null;
        }
    }

    async userupdate(userId: string, name: any, tel: any, email: any) {
        try {
            const user = await this.userRepository.findOne({ where: { u_id: userId } })
            user.name = name
            user.email = email
            user.phone_number = tel
            await user.save()
            return {
                message: '수량이 성공적으로 변경되었습니다.',
                success: true,
                order: user,
            }
        } catch (error) {
            console.error("size change Error:", error);
            throw new Error('수량 변경 오류가 발생했습니다.');
        }
    }

    async useraddress(userId: string, address: any, detailaddress: any) {
        try {
            const user = await this.userRepository.findOne({ where: { u_id: userId } })
            user.address = address
            user.detailAddress = detailaddress
            await user.save()
            return {
                message: '주소가 성공적으로 변경되었습니다.',
                success: true,
                order: user,
            }
        } catch (error) {
            console.error("size change Error:", error);
            throw new Error('수량 변경 오류가 발생했습니다.');
        }
    }

    async cartQuantityChangeBtn(cartId: any, value: any) {
        try {
            const cart = await this.cartRepository.findOne({ where: { c_id: cartId } })
            if (!cart) {
                throw new Error('사이즈 변경 오류가 발생했습니다.');
            }
            if (value == "+") {
                cart.quantity = cart.quantity + 1
            } else {
                cart.quantity = cart.quantity - 1 < 0 ? cart.quantity = 0 : cart.quantity - 1
            }
            await this.cartRepository.save(cart)
            return {
                message: '수량이 성공적으로 변경되었습니다.',
                success: true,
                order: cart,
            }
        } catch (error) {
            console.error("size change Error:", error);
            throw new Error('수량 변경 오류가 발생했습니다.');
        }
    }

    async cartSizeChangeBtn(cartId: any, value: any) {
        try {
            const cart = await this.cartRepository.findOne({ where: { c_id: cartId } })
            if (!cart) {
                throw new Error('사이즈 변경 오류가 발생했습니다.');
            }
            cart.size = value
            await this.cartRepository.save(cart)
            return {
                message: '사이즈가 성공적으로 변경되었습니다.',
                success: true,
                order: cart,
            }
        } catch (error) {
            console.error("size change Error:", error);
            throw new Error('사이즈 변경 오류가 발생했습니다.');
        }
    }

    async buyOrder(userId: string, categoryArray: any): Promise<any> {
        try {
            const user = await this.userRepository.findOne({ where: { u_id: userId } });

            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }

            const carts = categoryArray.map((item: any) => {
                return item.c_id
            })
            console.log(carts);
            
            const newOrder = new Order();
            newOrder.user = user;
            newOrder.cartArray = carts

            const order = await this.orderRepository.save(newOrder);

            return {
                message: '구매 요청이 성공적으로 저장되었습니다.',
                success: true,
                order: order,
            };
        } catch (error) {
            console.error("buyOrder Error:", error);
            throw new Error('구매 중 오류가 발생했습니다.');
        }
    }

    //주문 취소
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

    async getCarts(carts: any[]) {
        const cartArray = [];
        await Promise.all(carts.map(async (item) => {
            const cart = await this.cartRepository.findOne({ where: { c_id: item.c_id }, relations: ['item'], });
            const formattedCart = {
                c_id: cart.c_id,
                size: cart.size,
                quantity: cart.quantity,
                isOrdered: cart.isOrdered,
                createdAt: cart.createdAt,
                item: {
                    i_id: cart.item.i_id,
                    brand: cart.item.brand,
                    title: cart.item.title,
                    category: cart.item.category,
                    price: cart.item.price,
                    discount: cart.item.discount,
                    point: cart.item.point,
                    photo: cart.item.photo
                }
            };

            cartArray.push(formattedCart);
        }));
        return cartArray;
    }

    async getItem(item: number, user: string) {
        const cart = await this.cartRepository.find({ where: { user: { u_id: user }, item: { i_id: item } }, relations: ['item'] })
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
