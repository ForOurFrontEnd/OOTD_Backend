import { Body, Controller, Get, Headers, Post, Res } from '@nestjs/common';
import { UserService } from 'src/member/user/user.service';
import { CartService } from './cart.service';


@Controller('cart')
export class CartController {
  constructor(
    private readonly userService: UserService,
    private readonly cartService: CartService,
  ) { }

  @Post('press')
  async pressLikeButton(@Headers('cookie') cookie, @Res() res, @Body('itemId') itemId: number, @Body('itemSize') itemSize: string) {
    try {
      const decodeData = await this.userService.decodeToken(cookie);
      if (!decodeData) {
        throw new Error('유효한 사용자를 찾을 수 없습니다.');
      }
      const user = await this.userService.findByEmail(decodeData.user.email)
      const result = await this.cartService.pushCartButton(user.u_id, itemId, itemSize);
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

  @Get('view')
  async getCartData(@Headers('cookie') cookie, @Res() res) {
    try {
      const decodeData = await this.userService.decodeToken(cookie);
      if (!decodeData) {
        throw new Error('유효한 사용자를 찾을 수 없습니다.');
      }
      const user = await this.userService.findByEmail(decodeData.user.email)
      const result = await this.cartService.getCartData(user.u_id);
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

  @Post('delete')
  async deleteCartOne(@Headers('cookie') cookie, @Res() res, @Body('cartId') cartId: number) {
    try {
      console.log(cartId)
      const decodeData = await this.userService.decodeToken(cookie);
      if (!decodeData) {
        throw new Error('유효한 사용자를 찾을 수 없습니다.');
      }
      const user = await this.userService.findByEmail(decodeData.user.email)
      const result = await this.cartService.deleteOneCartButton(user.u_id, cartId);
      res.send(result);
    } catch (error) {
      console.error("deleteCartOneButton Error:", error);
      res.status(500).send({
        message: '장바구니 상품 삭제 처리중 오류가 발생했습니다.',
        success: false,
        error: error.message || 'Internal Server Error',
      });
    }
  }

  @Post('delete_chosen')
  async deleteChosenCart(@Headers('cookie') cookie, @Res() res, @Body('checkedCartItems') checkedCartItems: []) {
    try {
      const decodeData = await this.userService.decodeToken(cookie);
      if (!decodeData) {
        throw new Error('유효한 사용자를 찾을 수 없습니다.');
      }
      const user = await this.userService.findByEmail(decodeData.user.email)
      const result = await this.cartService.deleteChosenCartButton(user.u_id, checkedCartItems);
      res.send(result);
    } catch (error) {
      console.error("deleteCartOneButton Error:", error);
      res.status(500).send({
        message: '장바구니 상품 삭제 처리중 오류가 발생했습니다.',
        success: false,
        error: error.message || 'Internal Server Error',
      });
    }
  }
}

