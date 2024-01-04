import { Order } from "src/circulation/order/entity/order.entity";
import { Like } from "src/interaction/like/entity/like.entity";
import { Review } from "src/interaction/review/entity/review.entity";
import { Comment } from "src/interaction/comment/entity/comment.entity";
import { Search } from "src/article/search/entity/search.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class LocalBuyer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => Review, (review) => review.localBuyer)
  reviews: Review[];

  @OneToMany(() => Comment, (comment) => comment.localBuyer)
  comments: Comment[];

  @OneToMany(() => Order, (order) => order.localBuyer)
  orders: Order[];

  @OneToOne(() => Like, (like) => like.localBuyer)
  like: Like;

  @OneToMany(() => Search, (search) => search.localBuyer)
  search: Search[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
