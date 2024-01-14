import { Cart } from 'src/cart/entity/cart.entity';
import { Item } from 'src/item/entity/item.entity';
import { Like } from 'src/like/entity/like.entity';
import { Order } from 'src/order/entity/order.entity';
import { Review } from 'src/review/entity/review.entity';
import { Seller } from 'src/seller/entity/seller.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  u_id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  kakao_email: string;

  @Column({ nullable: true })
  google_email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: '/images/profile/default_image.jpeg' })
  photo: string;
  
  @Column({ nullable: true })
  phone_number: string;
  
  @Column({ default: 1000 })
  point: number;

  @Column({ default: false })
  isAutoLogin: boolean;

  @OneToMany(() => Cart, cart => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @ManyToMany(() => Like, like => like.user)
  likes: Like[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @ManyToMany(() => Seller, seller => seller.users)
  @JoinTable()
  sellers: Seller[];
  
  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
