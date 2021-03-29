import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Star extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  user_id: string;

  @Column()
  liker_id: number;

  @Column("datetime", { nullable: true })
  created_at: string;

  @Column("datetime", { nullable: true })
  updated_at: string;

  @ManyToOne(() => User, (u) => u.stars)
  @JoinColumn({ name: "user_id" })
  user: Promise<User>;
}
