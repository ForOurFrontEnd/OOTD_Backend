import { Review } from "src/interaction/review/entity/review.entity";
import { LocalBuyer } from "src/member/buyer/entity/localbuyer.entity";
import { SocialBuyer } from "src/member/buyer/entity/socialbuyer.entity";
import { Seller } from "src/member/seller/entity/seller.entity";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Review, (review) => review.comments, { cascade: true })
  review: Review;

  @OneToMany(() => Comment, (child) => child.parent)
  children: Comment[];

  @ManyToOne(() => Comment, (parent) => parent.children, { cascade: true })
  parent: Comment;

  @ManyToOne(() => LocalBuyer, (localBuyer) => localBuyer.comments, {
    cascade: true,
  })
  localBuyer: LocalBuyer;

  @ManyToOne(() => SocialBuyer, (socialBuyer) => socialBuyer.comments, {
    cascade: true,
  })
  socialBuyer: SocialBuyer;

  @ManyToOne(() => Seller, (seller) => seller.comments, { cascade: true })
  seller: Seller;

  @Column()
  commentDate: Date;
}
