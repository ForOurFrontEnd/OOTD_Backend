import { Cart } from 'src/cart/entity/cart.entity';
import { User } from 'src/member/user/entity/user.entity';
import { Order } from 'src/order/entity/order.entity';
import { Review } from 'src/review/entity/review.entity';
import { Seller } from 'src/seller/entity/seller.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, Unique } from 'typeorm';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn()
  i_id: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 ,nullable: true})
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 ,nullable: true})
  discount: number;

  @Column({ type: 'int', default: 0})
  point: number;

  @Column({ type: 'text', nullable: true })
  photo: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Seller, seller => seller.items)
  seller: Seller;

  @OneToMany(() => Review, review => review.item)
  reviews: Review[];

  @OneToMany(() => User, user => user.likes)
  likes: User[];

  @OneToMany(() => Order, order => order.item)
  orders: Order[];

  @OneToMany(() => Cart, cart => cart.item)
  carts: Cart;
}
