import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
    ) { }

    async itemReview(id: number) {
        const review = await this.reviewRepository.find({ where: { r_id: id } })
        console.log(review);
        if (review) {
            return review
        } else {
            return "잘못된 요청입니다."
        }
    }
    async reviewCreate(){
        
    }

}
