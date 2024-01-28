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

    @Get("carts")
    async orderCarts(@Headers("cookie") cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const { cart } = req.query;
            const carts = await this.orderService.getCarts(cart)
            res.send(carts);
        } catch (error) {
            console.error("pressLikeButton Error:", error);
            res.status(500).send({
                message: '결제 페이지에서 오류가 발생했습니다.',
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    }
    @Post('press')
    async pressLikeButton(@Headers('cookie') cookie, @Res() res, @Body('itemId') itemId: number) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const user = await this.userService.findByEmail(decodeData.user.email)
            const result = await this.cartService.pushCartButton(user.u_id, itemId);
            res.send(result);
        } catch (error) {
            console.error("pressLikeButton Error:", error);
            res.status(500).send({
                message: '좋아요 처리 중 오류가 발생했습니다.',
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
            const user = await this.userService.findByEmail(decodeData.user.email)
            const cart = await this.cartService.getCartData(user.u_id)
            const result = await this.orderService.buyOrder(user.u_id, 20, 3, "s");
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
