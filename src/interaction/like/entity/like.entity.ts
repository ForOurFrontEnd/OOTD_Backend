import { Item } from "src/article/item/entity/item.entity";
import { LocalBuyer } from "src/member/buyer/entity/localbuyer.entity";
import { SocialBuyer } from "src/member/buyer/entity/socialbuyer.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => LocalBuyer, (localBuyer) => localBuyer.like)
  localBuyer: LocalBuyer;

  @OneToOne(() => SocialBuyer, (socialBuyer) => socialBuyer.like)
  socialBuyer: SocialBuyer;

  @OneToOne(() => Item, (item) => item.like)
  item: Item;

  @Column({ default: false })
  isLike: boolean;
}
