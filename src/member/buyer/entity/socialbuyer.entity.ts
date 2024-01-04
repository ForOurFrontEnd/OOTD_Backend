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
export class SocialBuyer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  photo: string;

  @OneToMany(() => Review, (review) => review.socialBuyer)
  reviews: Review[];

  @OneToMany(() => Comment, (comment) => comment.socialBuyer)
  comments: Comment[];

  @OneToMany(() => Order, (order) => order.socialBuyer)
  orders: Order[];

  @OneToMany(() => Search, (search) => search.socialBuyer)
  search: Search[];

  @OneToOne(() => Like, (like) => like.socialBuyer)
  like: Like;

  @Column({ nullable: true, unique: true })
  connectKey?: string;

  @Column({ nullable: true, unique: true })
  secretKey?: string;
}
