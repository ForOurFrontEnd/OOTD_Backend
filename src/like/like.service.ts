import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entity/like.entity';
import { Repository } from 'typeorm';
import { User } from 'src/member/user/entity/user.entity';
import { Item } from 'src/item/entity/item.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) { }
  

  async pushLikeButton(userId: string, itemId: number): Promise<any> {
    try {
      // 사용자와 아이템 정보 조회
      const user = await this.userRepository.findOne({ where: { u_id: userId } });
      const item = await this.itemRepository.findOne({ where: { i_id: itemId } });

      if (!user || !item) {
        throw new Error('사용자 또는 아이템을 찾을 수 없습니다.');
      }

      // 이미 좋아요한 경우에 대한 처리
      const existingLike = await this.likeRepository.findOne({ where:{ user, item} });
      if (existingLike) {
        throw new Error('이미 좋아요한 아이템입니다.');
      }

      // Like 엔티티 생성 및 설정
      const newLike = new Like();
      newLike.user = user;
      newLike.item = item;

      // Like 엔티티 저장
      const savedLike = await this.likeRepository.save(newLike);

      // 성공적으로 저장된 경우에 대한 응답이나 다른 처리를 수행
      return {
        message: '좋아요가 성공적으로 저장되었습니다.',
        success: true,
        like: savedLike,
      };
    } catch (error) {
      console.error("pushLikeButton Error:", error);
      throw new Error('좋아요 저장 중 오류가 발생했습니다.');
    }
  }
}
