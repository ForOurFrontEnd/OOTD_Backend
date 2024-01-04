import { Cart } from "src/circulation/cart/entity/cart.entity";
import { Like } from "src/interaction/like/entity/like.entity";
import { Seller } from "src/member/seller/entity/seller.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from "typeorm";

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  price: string;

  @Column({ nullable: true })
  discount: number;

  @Column({ nullable: true })
  point: number;

  @OneToOne(() => Like, (like) => like.item, { nullable: true })
  like: Like;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: 0, nullable: true })
  likeCount: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @ManyToOne(() => Seller, (seller) => seller.items)
  @JoinColumn({ name: "seller_id" })
  seller: Seller;

  @Column({ default: 10, nullable: true })
  stockCount: number;

  @Column({ nullable: true })
  itemDate: Date;
}
