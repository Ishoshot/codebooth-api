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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Team_1 = require("./Team");
let Project = class Project extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 100,
        unique: true,
    }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    typeorm_1.Column("bool", { default: true }),
    __metadata("design:type", Boolean)
], Project.prototype, "isPublic", void 0);
__decorate([
    typeorm_1.Column("number", { nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column("number", { nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "team_id", void 0);
__decorate([
    typeorm_1.Column("datetime", { nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "created_at", void 0);
__decorate([
    typeorm_1.Column("datetime", { nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (p) => p.projects, { eager: true }),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", Promise)
], Project.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Team_1.Team, (t) => t.projects),
    typeorm_1.JoinColumn({ name: "team_id" }),
    __metadata("design:type", Promise)
], Project.prototype, "team", void 0);
Project = __decorate([
    typeorm_1.Entity()
], Project);
exports.Project = Project;
//# sourceMappingURL=Project.js.map