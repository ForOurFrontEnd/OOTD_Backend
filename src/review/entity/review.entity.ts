import { Item } from 'src/item/entity/item.entity';
import { User } from 'src/member/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  r_id: number;

  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @ManyToOne(() => Item, item => item.reviews)
  item: Item;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int' })
  star: number;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
