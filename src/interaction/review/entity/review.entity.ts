import { LocalBuyer } from "src/member/buyer/entity/localbuyer.entity";
import { SocialBuyer } from "src/member/buyer/entity/socialbuyer.entity";
import { Comment } from "src/interaction/comment/entity/comment.entity";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("varchar", { array: true, nullable: true })
  image_url: string[];

  @Column()
  content: string;

  @ManyToOne(() => LocalBuyer, (localBuyer) => localBuyer.reviews, {
    eager: true,
  })
  localBuyer: LocalBuyer;

  @ManyToOne(() => SocialBuyer, (socialBuyer) => socialBuyer.reviews, {
    eager: true,
  })
  socialBuyer: SocialBuyer;

  @OneToMany(() => Comment, (comment) => comment.review)
  comments: Comment[];

  @Column()
  reviewDate: Date;
}
