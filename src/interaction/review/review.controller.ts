import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from "@nestjs/common";
import { ReviewService } from "./review.service";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(":itemId")
  async createReview(
    @Req() req,
    @Res() res,
    @Body() dto,
    @Param("itemId") itemId
  ) {
    const token = req.cookies.Authorization;
    const result = await this.reviewService.createReview(token, dto, itemId);
  }

  @Put()
  async updateReview() {}

  @Delete()
  async deleteReview() {}

  @Get()
  async getReviews() {}

  @Get()
  async getReview() {}
}
