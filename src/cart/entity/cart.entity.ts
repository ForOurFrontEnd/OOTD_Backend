import { Item } from 'src/item/entity/item.entity';
import { User } from 'src/member/user/entity/user.entity';
import { Order } from 'src/order/entity/order.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Column, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  c_id: number;

  @ManyToOne(() => User, user => user.carts)
  user: User;

  @ManyToOne(() => Item, item => item.carts)
  @JoinColumn({ name: "itemIId" })
  item: Item;

  @Column({})
  size:string;

  @Column({})
  quantity: number;
  
  @Column({ type: 'boolean', default: false})
  isOrdered: boolean;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
