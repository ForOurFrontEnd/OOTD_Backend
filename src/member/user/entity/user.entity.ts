import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string;

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
