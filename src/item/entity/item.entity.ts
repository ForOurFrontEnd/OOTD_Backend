import { Cart } from 'src/cart/entity/cart.entity';
import { User } from 'src/member/user/entity/user.entity';
import { Order } from 'src/order/entity/order.entity';
import { Review } from 'src/review/entity/review.entity';
import { Seller } from 'src/seller/entity/seller.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, Unique } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  i_id: number;

  @Column({ nullable: false })
  brand: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 ,nullable: false})
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 ,nullable: true})
  discount: number;

  @Column({ type: 'int', default: 0})
  point: number;

  @Column({ type: 'text', nullable: false })
  photo: string;
  
  @Column({ nullable: false })
  description: string;

  @ManyToOne(() => Seller, seller => seller.items)
  seller: Seller;

  @OneToMany(() => Review, review => review.item)
  reviews: Review[];

  @ManyToMany(() => User, user => user.likes)
  @JoinTable()
  likedBy: User[];

  @OneToMany(() => Order, order => order.item)
  orders: Order[];

  @ManyToMany(() => Cart, cart => cart.items)
  @JoinTable()
  carts: Cart[];
}
