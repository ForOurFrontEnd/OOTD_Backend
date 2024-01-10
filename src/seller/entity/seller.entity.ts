import { Item } from 'src/item/entity/item.entity';
import { User } from 'src/member/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToMany } from 'typeorm';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  s_id: number;

  @OneToMany(() => Item, item => item.seller)
  items: Item[];

  @ManyToMany(() => User, user => user.sellers)
  users: User[];
}
