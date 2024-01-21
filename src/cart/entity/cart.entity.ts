import { Item } from 'src/item/entity/item.entity';
import { User } from 'src/member/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Column, JoinColumn } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  c_id: number;

  @ManyToOne(() => User, user => user.carts)
  user: User;

  @ManyToOne(() => Item, item => item.carts)
  @JoinColumn({ name: "itemIId" })
  item: Item;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
