import { Item } from 'src/item/entity/item.entity';
import { User } from 'src/member/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { OrderState } from './order-state.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  o_id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToOne(() => Item, item => item.orders)
  item: Item;

  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.ORDERED,
  })
  state: OrderState;
  
  @Column({})
  size:string;

  @Column({})
  quantity:number;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
