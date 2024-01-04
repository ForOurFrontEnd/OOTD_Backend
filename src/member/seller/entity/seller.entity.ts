import { Item } from "src/article/item/entity/item.entity";
import { Comment } from "src/interaction/comment/entity/comment.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Seller extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  photo: string;

  @OneToMany(() => Item, (item) => item.seller)
  items: Item[];

  @OneToMany(() => Comment, (comment) => comment.seller)
  comments: Comment[];

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
