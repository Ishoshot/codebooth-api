import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Team } from "./Team";
import { User } from "./User";

@Entity()
export class TeamMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  user_id: string;

  @Column("number")
  team_id: number;

  @Column("text")
  team_name: string;

  @Column("text", { nullable: false })
  status: string;

  @Column("boolean", { default: false })
  request_seen: boolean;

  @Column("boolean", { default: false })
  response_seen: boolean;

  @Column("datetime", { nullable: true })
  created_at: string;

  @Column("datetime", { nullable: true })
  updated_at: string;

  @ManyToOne(() => Team, (t) => t.members)
  @JoinColumn({ name: "team_id" })
  team: Promise<Team>;

  @ManyToOne(() => User, (u) => u.teamsIn, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: Promise<User>;
}
