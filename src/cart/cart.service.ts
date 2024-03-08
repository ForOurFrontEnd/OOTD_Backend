import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { Repository } from 'typeorm';
import { User } from 'src/member/user/entity/user.entity';
import { Item } from 'src/item/entity/item.entity';
interface ItemArray {
  c_id : number;
  item:{
    i_id: number;
    photo: string;
    category: string;
    brand: string;
    title: string;
    discount: number;
    price: number;
  }
}
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) { }

  async pushCartButton(userId: string, itemId: number, itemSize: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { u_id: userId } });
      const item = await this.itemRepository.findOne({ where: { i_id: itemId } });

      if (!user || !item) {
        throw new Error('사용자 또는 아이템을 찾을 수 없습니다.');
      }

      const newCart = new Cart();
      newCart.user = user;
      newCart.item = item;
      newCart.size = itemSize
      newCart.quantity = 1

      const savedCart = await this.cartRepository.save(newCart);

      return {
        message: '좋아요가 성공적으로 저장되었습니다.',
        success: true,
        like: savedCart,
      };
    } catch (error) {
      console.error("pushLikeButton Error:", error);
      throw new Error('좋아요 저장 중 오류가 발생했습니다.');
    }
  }

  async getCartData(userId: string): Promise<any> { 
    const user = await this.userRepository.findOne({ where: { u_id: userId } });

    if (!user) {
      throw new Error('사용자 또는 아이템을 찾을 수 없습니다.');
    }

    const existingCart = await this.cartRepository.find({
      where: { user: { u_id: userId } },
      relations: ['item'], 
    });

    if (!existingCart) {
      return {
        message: '해당 유저의 장바구니에 상품이 없습니다.',
        success: false,
        data: null,
      };
    }

    return {
      message: '장바구니의 데이터를 성공적으로 가져왔습니다.',
      success: true,
      data: existingCart,
    };
  } catch (error) {
    console.error("getCartData Error:", error);
    throw new Error('장바구니 데이터 로드 중 오류가 발생했습니다.');
  };

  async deleteOneCartButton(userId: string, cartId: number): Promise<any> { 
    try {
      const user = await this.userRepository.findOne({ where: { u_id: userId } });
      const item = await this.cartRepository.findOne({ where: { c_id: cartId } });

      if (!user || !item) {
        throw new Error('사용자 또는 아이템을 찾을 수 없습니다.');
      }

      const existingLike = await this.cartRepository.findOne({ where: { user: { u_id: userId }, c_id: cartId } });
      if (existingLike) {
        await this.cartRepository.remove(existingLike);
        return {
          message: '이미 들어가있는 장바구니',
          success: true,
        };
      }

      return {
        message: '장바구니 상품이 성공적으로 삭제되었습니다.',
        success: true,
      };
    } catch (error) {
      console.error("pushLikeButton Error:", error);
      throw new Error('장바구니 상품 삭제 중 오류가 발생했습니다.');
    }
  }
  
  async deleteChosenCartButton(userId: string, checkedCartItems: ItemArray[]): Promise<any> { 
    try {
      
      const user = await this.userRepository.findOne({ where: { u_id: userId } });
      if (!user) {
        throw new Error('사용자 또는 아이템을 찾을 수 없습니다.');
      }
      const cartIdsToDelete = checkedCartItems.map((cart) => {
        return cart.c_id
      });

      for (let i = 0; i < cartIdsToDelete.length; i++){
        const existingCartItem = await this.cartRepository.findOne({ where: { user: {u_id:userId}, c_id: cartIdsToDelete[i] } });
          if (existingCartItem) {
            await this.cartRepository.remove(existingCartItem);
        }
      }


      return {
        message: '선택한 장바구니 상품이 성공적으로 삭제되었습니다.',
        success: true,
      };
    } catch (error) {
      console.error("pushLikeButton Error:", error);
      throw new Error('장바구니 상품 삭제 중 오류가 발생했습니다.');
    }
  }

  async changeSizeCart(userId: string, cartId: number ,itemSize: string): Promise<any> {
    try {
      
      const cartItem = await this.cartRepository.findOne({ where: {user: { u_id: userId }, c_id: cartId} });
      if (!cartItem) {
        throw new Error('사용자 또는 아이템을 찾을 수 없습니다.');
      }

      cartItem.size = itemSize;
      await this.cartRepository.save(cartItem);
    
      return {
        message: '선택한 장바구니 상품이 성공적으로 삭제되었습니다.',
        success: true,
      };
    } catch (error) {
      console.error("pushLikeButton Error:", error);
      throw new Error('장바구니 상품 삭제 중 오류가 발생했습니다.');
    }
  }
}

