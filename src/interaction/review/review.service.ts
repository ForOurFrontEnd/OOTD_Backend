import { Injectable } from "@nestjs/common";
import { LocalBuyer } from "src/member/buyer/entity/localbuyer.entity";
import { Repository } from "typeorm";
import { Review } from "./entity/review.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BuyerService } from "src/member/buyer/buyer.service";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>
  ) {}
  private readonly buyerService: BuyerService;

  async createReview(token, dto, itemId) {}
}
