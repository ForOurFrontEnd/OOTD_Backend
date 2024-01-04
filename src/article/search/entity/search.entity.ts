import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { LocalBuyer } from "src/member/buyer/entity/localbuyer.entity";
import { SocialBuyer } from "src/member/buyer/entity/socialbuyer.entity";

@Entity()
export class Search extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  keyword: string;

  @ManyToOne(() => SocialBuyer, (socialBuyer) => socialBuyer.search)
  @JoinColumn({ name: "socialbuyer_id" })
  socialBuyer: SocialBuyer;

  @ManyToOne(() => LocalBuyer, (localBuyer) => localBuyer.search)
  @JoinColumn({ name: "localbuyer_id" })
  localBuyer: LocalBuyer;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
