import { Cart } from "src/circulation/cart/entity/cart.entity";
import { Delivery } from "src/circulation/delivery/entity/delivery.entity";
import { LocalBuyer } from "src/member/buyer/entity/localbuyer.entity";
import { SocialBuyer } from "src/member/buyer/entity/socialbuyer.entity";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LocalBuyer, (localBuyer) => localBuyer.orders)
  localBuyer: LocalBuyer;

  @ManyToOne(() => SocialBuyer, (socialBuyer) => socialBuyer.orders)
  socialBuyer: SocialBuyer;

  @OneToOne(() => Cart, (cart) => cart.order, { cascade: true })
  cart: Cart;

  @OneToOne(() => Delivery, (delivery) => delivery.order, { cascade: true })
  delivery: Delivery;

  @Column()
  orderDate: Date;

  @Column({ type: "boolean" })
  status: boolean;
}
