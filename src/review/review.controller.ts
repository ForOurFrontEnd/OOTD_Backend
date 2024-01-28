import { Controller, Get, Headers, Post, Req, Res } from '@nestjs/common';
import { ReviewService } from './review.service';
import { UserService } from 'src/member/user/user.service';

@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly userService: UserService,
    ) { }

    @Get("item")
    async detailReview(@Req() req, @Res() res) {

    }

    @Get("seller")
    async sellerReview(@Req() req, @Res() res) {

    }

    @Post("create")
    async reviewCreate(@Headers('cookie') cookie, @Req() req, @Res() res) {
        try {
            const decodeData = await this.userService.decodeToken(cookie);
            if (!decodeData) {
                throw new Error('유효한 사용자를 찾을 수 없습니다.');
            }
            const user = await this.userService.findByEmail(decodeData.user.email)
            const result = await this.reviewService.reviewCreate();
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
