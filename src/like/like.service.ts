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
      const user = await this.userRepository.findOne({ where: { u_id: userId } });
      const item = await this.itemRepository.findOne({ where: { i_id: itemId } });

      if (!user || !item) {
        throw new Error('사용자 또는 아이템을 찾을 수 없습니다.');
      }

      const existingLike = await this.likeRepository.findOne({ where: { user: { u_id: userId }, item: { i_id: itemId } } });
      if (existingLike) {
        await this.likeRepository.remove(existingLike);
        return {
          message: '이미 좋아요한 아이템을 취소했습니다.',
          success: true,
        };
      }

      const newLike = new Like();
      newLike.user = user;
      newLike.item = item;

      const savedLike = await this.likeRepository.save(newLike);

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

  async findLikeItems(userId: string) {
    const likes = await this.likeRepository.find({
      where: { user: { u_id: userId } },
      relations: ['item'],
    });
    const likedItems = likes.map(like => like.item);
    return likedItems
  }
  
  async pressUnLikeButton(userId: string, itemId: number) {
    try {
      const user = await this.userRepository.findOne({ where: { u_id: userId } });
      const item = await this.itemRepository.findOne({ where: { i_id: itemId } });

      if (!user || !item) {
        throw new Error('사용자 또는 아이템을 찾을 수 없습니다.');
      }

      const existingLike = await this.likeRepository.findOne({ where: { user: { u_id: userId }, item: { i_id: itemId } } });
      if (existingLike) {
        await this.likeRepository.remove(existingLike);
        return {
          message: '해당 아이템의 좋아요를 취소했습니다.',
          success: true,
        };
      }
    } catch (error) {
      console.error("pressUnLikeButton Error:", error);
      throw new Error('좋아요 취소 중 오류가 발생했습니다.');
    }
  }
}
