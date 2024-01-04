import { Item } from "src/article/item/entity/item.entity";
import { Order } from "src/circulation/order/entity/order.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, (order) => order.cart)
  order: Order;

  @OneToMany(() => Item, (item) => item.cart)
  items: Item[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice: number;
}
