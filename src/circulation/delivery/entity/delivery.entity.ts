import { Address } from "src/circulation/address/entity/address.entity";
import { Order } from "src/circulation/order/entity/order.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Delivery extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, (order) => order.delivery)
  order: Order;

  @OneToOne(() => Address, (address) => address.delivery)
  address: Address;

  @Column({ type: "boolean", nullable: true })
  status: boolean;
}
