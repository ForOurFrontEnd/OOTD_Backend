import { User } from 'src/member/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { OrderState } from './order-state.enum';
import { Cart } from 'src/cart/entity/cart.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  o_id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.ORDERED,
  })
  state: OrderState;

  @Column('integer', { array: true, default: [] })
  cartArray: number[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}