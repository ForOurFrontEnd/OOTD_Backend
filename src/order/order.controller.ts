import { Controller, Delete, Headers, Post, Put, Req, Res } from '@nestjs/common';
import { UserService } from 'src/member/user/user.service';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor(
        private readonly userService: UserService,
        private readonly orderService: OrderService
    ) { }

    @Post("requst")
    async orderRequst(@Headers("cookie") cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const user = await this.userService.findByEmail(decodeData.user.email)
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

    // 판매자 배송정보 수정 구현중 미완성
    // @Put("change")
    // async sellerOrder(@Headers("cookie") cookie, @Req() req, @Res() res) {
    //     try {
    //         const decodeData = await this.userService.decodeToken(cookie);
    //         if (!decodeData) {
    //             throw new Error('유효한 사용자를 찾을 수 없습니다.');
    //         }
    //         const user = await this.userService.findByEmail(decodeData.user.email)
    //         const result = await this.orderService.buyOrder(user.u_id, 20, 3, "s");
    //         res.send(result);
    //     } catch (error) {
    //         console.error("pressLikeButton Error:", error);
    //         res.status(500).send({
    //             message: '결제 처리 중 오류가 발생했습니다.',
    //             success: false,
    //             error: error.message || 'Internal Server Error',
    //         });
    //     }
    // }

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

    @Delete("allcancel")
    async allOrderCancel(@Headers("cookie") cookie, @Req() req, @Res() res) {
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
