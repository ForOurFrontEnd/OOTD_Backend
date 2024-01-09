import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  u_id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  kakao_email: string;

  @Column({ nullable: true })
  google_email: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  photo: string;
  
  @Column({ nullable: true })
  phone_number: string;
  
  @Column({ default: 0 })
  point: number;

  @Column({ default: false })
  isAutoLogin: boolean;
  
  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
