import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";
import { TeamMember } from "./TeamMember";

@Entity()
export class Team extends BaseEntity {
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

  @Column()
  user_id: number;

  @Column("datetime", { nullable: true })
  created_at: string;

  @Column("datetime", { nullable: true })
  updated_at: string;

  @ManyToOne(() => User, (t) => t.teams, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: Promise<User>;

  @OneToMany(() => Project, (p) => p.team, { eager: true })
  projects: Promise<Project[]>;

  @OneToMany(() => TeamMember, (t) => t.team, { eager: true })
  members: Promise<TeamMember[]>;
}
