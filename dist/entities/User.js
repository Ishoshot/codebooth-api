"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Flair_1 = require("./Flair");
const Todo_1 = require("./Todo");
const Team_1 = require("./Team");
const Project_1 = require("./Project");
const TeamMember_1 = require("./TeamMember");
const Star_1 = require("./Star");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 150,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "githubId", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 150,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "github_url", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "location", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "company", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    typeorm_1.Column("datetime", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "created_at", void 0);
__decorate([
    typeorm_1.Column("datetime", { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.Column("bool", { default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "verified", void 0);
__decorate([
    typeorm_1.OneToMany(() => Todo_1.Todo, (t) => t.creator),
    __metadata("design:type", Promise)
], User.prototype, "todos", void 0);
__decorate([
    typeorm_1.OneToMany(() => Flair_1.Flair, (f) => f.user, { eager: true }),
    __metadata("design:type", Promise)
], User.prototype, "flairs", void 0);
__decorate([
    typeorm_1.OneToMany(() => Team_1.Team, (t) => t.user),
    __metadata("design:type", Promise)
], User.prototype, "teams", void 0);
__decorate([
    typeorm_1.OneToMany(() => Project_1.Project, (p) => p.user),
    __metadata("design:type", Promise)
], User.prototype, "projects", void 0);
__decorate([
    typeorm_1.OneToMany(() => TeamMember_1.TeamMember, (t) => t.user),
    __metadata("design:type", Promise)
], User.prototype, "teamsIn", void 0);
__decorate([
    typeorm_1.OneToMany(() => Star_1.Star, (s) => s.user, { eager: true }),
    __metadata("design:type", Promise)
], User.prototype, "stars", void 0);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map