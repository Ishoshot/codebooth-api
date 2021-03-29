import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Flair } from "./Flair";
import { Todo } from "./Todo";
import { Team } from "./Team";
import { Project } from "./Project";
import { TeamMember } from "./TeamMember";
import { Star } from "./Star";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 150,
    unique: true,
  })
  githubId: string;

  @Column("text", { nullable: true })
  name: string;

  @Column({
    type: "varchar",
    length: 150,
    unique: true,
  })
  email: string;

  @Column("text", { nullable: true })
  image: string;

  @Column("text", { nullable: true })
  github_url: string;

  @Column("text", { nullable: true })
  location: string;

  @Column("text", { nullable: true })
  company: string;

  @Column("text", { nullable: true })
  bio: string;

  @Column("datetime", { nullable: true })
  created_at: string;

  @Column("datetime", { nullable: true })
  updated_at: string;

  @Column("bool", { default: false })
  verified: boolean;

  @OneToMany(() => Todo, (t) => t.creator)
  todos: Promise<Todo[]>;

  @OneToMany(() => Flair, (f) => f.user, { eager: true })
  flairs: Promise<Flair[]>;

  @OneToMany(() => Team, (t) => t.user)
  teams: Promise<Team[]>;

  @OneToMany(() => Project, (p) => p.user)
  projects: Promise<Project[]>;

  @OneToMany(() => TeamMember, (t) => t.user)
  teamsIn: Promise<TeamMember[]>;

  @OneToMany(() => Star, (s) => s.user, { eager: true })
  stars: Promise<Star[]>;
}
