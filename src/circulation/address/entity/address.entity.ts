import { Delivery } from "src/circulation/delivery/entity/delivery.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Delivery, (delivery) => delivery.address)
  delivery: Delivery;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  zipcode: string;
}
