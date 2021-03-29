import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Team } from "./Team";

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 100,
    unique: true,
  })
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("bool", { default: true })
  isPublic: boolean;

  @Column("number", { nullable: true })
  user_id: number;

  @Column("number", { nullable: true })
  team_id: number;

  @Column("datetime", { nullable: true })
  created_at: string;

  @Column("datetime", { nullable: true })
  updated_at: string;

  @ManyToOne(() => User, (p) => p.projects, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: Promise<User>;

  @ManyToOne(() => Team, (t) => t.projects)
  @JoinColumn({ name: "team_id" })
  team: Promise<Team>;
}
