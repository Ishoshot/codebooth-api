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
export class Flair extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (u) => u.flairs)
  @JoinColumn({ name: "user_id" })
  user: Promise<User>;
}
