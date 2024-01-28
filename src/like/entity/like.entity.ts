import { Item } from 'src/item/entity/item.entity';
import { User } from 'src/member/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  l_id: number;

  @ManyToOne(() => User, user => user.likes)
  user: User;

  @ManyToOne(() => Item, item => item.likes)
  item: Item;
}
