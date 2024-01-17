import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { LikeService } from './like.service';
import { UserService } from 'src/member/user/user.service';

@Controller('like')
export class LikeController {
  constructor(
    private readonly userService: UserService,
    private readonly likeService: LikeService
  ) { }
  
  @Post('press')
  async pressLikeButton(@Headers('cookie') cookie, @Res() res, @Body('itemId') itemId) {
    try {
      const decodeData = await this.userService.decodeToken(cookie);
      if (!decodeData) {
        throw new Error('유효한 사용자를 찾을 수 없습니다.');
      }
      const user = await this.userService.findByEmail(decodeData.user.email)
      const result = await this.likeService.pushLikeButton(user.u_id, 11);
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
}
