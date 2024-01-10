import { Item } from 'src/item/entity/item.entity';
import { User } from 'src/member/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Column } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  c_id: number;

  @ManyToOne(() => User, user => user.carts)
  user: User;

  @ManyToMany(() => Item, item => item.carts)
  @JoinTable()
  items: Item[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
