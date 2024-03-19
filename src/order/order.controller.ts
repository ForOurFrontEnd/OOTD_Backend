import { Body, Controller, Delete, Get, Headers, Post, Put, Req, Res } from '@nestjs/common';
import { UserService } from 'src/member/user/user.service';
import { OrderService } from './order.service';
import { CartService } from 'src/cart/cart.service';

@Controller('order')
export class OrderController {
    constructor(
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly cartService: CartService
    ) { }

    //개인정보 수정
    @Post("userupdate")
    async userUpdate(@Headers("cookie") cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const name = req.body.isName;
            const tel = req.body.isTel
            const email = req.body.isEmail
            const user = await this.userService.findByEmail(decodeData.user.email)
            const users = await this.orderService.userupdate(user.u_id,name, tel,email)
            res.send(users);
        } catch (error) {
            console.error("Cart order Error:", error);
            res.status(500).send({
                message: '결제 페이지에서 오류가 발생했습니다.',
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    }

    //주소 업데이트
    @Post("useraddress")
    async addressUpdate(@Headers("cookie") cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const address = req.body.isAddr;
            const detailaddress = req.body.isDetailAddr
            const user = await this.userService.findByEmail(decodeData.user.email)
            const useraddress = await this.orderService.useraddress(user.u_id,address, detailaddress)
            res.send(useraddress);
        } catch (error) {
            console.error("Cart order Error:", error);
            res.status(500).send({
                message: '결제 페이지에서 오류가 발생했습니다.',
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    }

    //카트 수량변경 버튼 
    @Post("quantitychange")
    async cartQuantityChangeBtn(@Headers("cookie") cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const cartId = req.body.cartId;
            const value = req.body.value
            const cartquantity = await this.orderService.cartQuantityChangeBtn(cartId, value)
            res.send(cartquantity);
        } catch (error) {
            console.error("Cart order Error:", error);
            res.status(500).send({
                message: '결제 페이지에서 오류가 발생했습니다.',
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    }

    //카트 사이즈 변경 버튼
    @Post("sizechange")
    async cartSizeChangeBtn(@Headers("cookie") cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const cartId = req.body.cartId;
            const value = req.body.value
            const cartsize = await this.orderService.cartSizeChangeBtn(cartId, value)
            res.send(cartsize);
        } catch (error) {
            console.error("Cart order Error:", error);
            res.status(500).send({
                message: '결제 페이지에서 오류가 발생했습니다.',
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    }

    //결제 페이지 장바구니 상품
    @Get("carts")
    async orderCarts(@Headers("cookie") cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const { cart } = req.query;
            const carts = await this.orderService.getCarts(cart)
            const user = await this.userService.findByEmail(decodeData.user.email)
            res.send([carts,user]);
        } catch (error) {
            console.error("Cart order Error:", error);
            res.status(500).send({
                message: '결제 페이지에서 오류가 발생했습니다.',
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    }
    
    //결제 페이지 상품
    @Get("item")
    async orderItem(@Headers("cookie") cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const { item } = req.query;
            const user = await this.userService.findByEmail(decodeData.user.email)
            const itemOrder = await this.orderService.getItem(item,user.u_id)
            res.send([itemOrder, user]);
        } catch (error) {
            console.error("pressLikeButton Error:", error);
            res.status(500).send({
                message: '결제 페이지에서 오류가 발생했습니다.',
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    }

    //수정 내용 cart[]을 받아서 저장하고 엔티티 수정 cart랑 연결 
    @Post("requst")
    async orderRequst(@Headers("cookie") cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const cart = req.body.categoryArray
            const user = await this.userService.findByEmail(decodeData.user.email)
            const result = await this.orderService.buyOrder(user.u_id,cart);
            res.send(result);
        } catch (error) {
            console.error("pressLikeButton Error:", error);
            res.status(500).send({
                message: '결제 처리 중 오류가 발생했습니다.',
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    }

    //주문 취소 (수정필요)
    @Delete("cancel")
    async orderCancel(@Headers("cookie") cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const orderid = req.body.oderid
            const result = await this.orderService.cancelOrder(orderid);
            res.send(result);
        } catch (error) {
            console.error("pressLikeButton Error:", error);
            res.status(500).send({
                message: '결제 처리 중 오류가 발생했습니다.',
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    }



}
