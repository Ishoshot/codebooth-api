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
exports.TeamMember = void 0;
const typeorm_1 = require("typeorm");
const Team_1 = require("./Team");
const User_1 = require("./User");
let TeamMember = class TeamMember extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], TeamMember.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], TeamMember.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column("number"),
    __metadata("design:type", Number)
], TeamMember.prototype, "team_id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], TeamMember.prototype, "team_name", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: false }),
    __metadata("design:type", String)
], TeamMember.prototype, "status", void 0);
__decorate([
    typeorm_1.Column("boolean", { default: false }),
    __metadata("design:type", Boolean)
], TeamMember.prototype, "request_seen", void 0);
__decorate([
    typeorm_1.Column("boolean", { default: false }),
    __metadata("design:type", Boolean)
], TeamMember.prototype, "response_seen", void 0);
__decorate([
    typeorm_1.Column("datetime", { nullable: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "created_at", void 0);
__decorate([
    typeorm_1.Column("datetime", { nullable: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Team_1.Team, (t) => t.members),
    typeorm_1.JoinColumn({ name: "team_id" }),
    __metadata("design:type", Promise)
], TeamMember.prototype, "team", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (u) => u.teamsIn, { eager: true }),
    typeorm_1.JoinColumn({ name: "user_id" }),
    __metadata("design:type", Promise)
], TeamMember.prototype, "user", void 0);
TeamMember = __decorate([
    typeorm_1.Entity()
], TeamMember);
exports.TeamMember = TeamMember;
//# sourceMappingURL=TeamMember.js.map