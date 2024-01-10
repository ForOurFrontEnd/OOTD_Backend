import { Cart } from 'src/cart/entity/cart.entity';
import { User } from 'src/member/user/entity/user.entity';
import { Order } from 'src/order/entity/order.entity';
import { Review } from 'src/review/entity/review.entity';
import { Seller } from 'src/seller/entity/seller.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  i_id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'int', default: 0 })
  point: number;

  @Column({ type: 'text' })
  image_url: string;
  
  @Column()
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
