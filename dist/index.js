"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv-safe").config();
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const passport_github_1 = require("passport-github");
const passport_1 = __importDefault(require("passport"));
const User_1 = require("./entities/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const Todo_1 = require("./entities/Todo");
const isAuth_1 = require("./isAuth");
const date_1 = __importDefault(require("./utils/date"));
const Flair_1 = require("./entities/Flair");
const Team_1 = require("./entities/Team");
const Project_1 = require("./entities/Project");
const TeamMember_1 = require("./entities/TeamMember");
const Star_1 = require("./entities/Star");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        type: "mysql",
        host: "127.0.0.1",
        username: "root",
        password: "",
        database: "codebooth",
        entities: [path_1.join(__dirname, "./entities/*.*")],
        logging: true,
        synchronize: true,
        charset: "utf8mb4_unicode_ci",
    }).catch((err) => {
        console.log(err);
    });
    const app = express_1.default();
    passport_1.default.serializeUser(function (user, done) {
        done(null, user.accessToken);
    });
    app.use(cors_1.default({ origin: "*" }));
    app.use(passport_1.default.initialize());
    app.use(express_1.default.json());
    passport_1.default.use(new passport_github_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback",
    }, function (_, __, profile, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = profile._json;
            let user = yield User_1.User.findOne({ where: { githubId: profile.id } });
            if (user) {
                user.name = payload.name;
                user.image = payload.avatar_url;
                user.updated_at = date_1.default().toString();
                user.save();
            }
            else {
                user = yield User_1.User.create({
                    name: payload.name,
                    email: payload.email,
                    githubId: payload.id,
                    image: payload.avatar_url,
                    github_url: payload.html_url,
                    company: payload.company,
                    location: payload.location,
                    bio: payload.bio.toString(),
                    created_at: date_1.default().toString(),
                    updated_at: date_1.default().toString(),
                }).save();
            }
            cb(null, {
                accessToken: jsonwebtoken_1.default.sign({ userId: user.id }, process.env.SECRET, {
                    expiresIn: "1y",
                }),
            });
        });
    }));
    app.get("/auth/github", passport_1.default.authenticate("github", { session: false }));
    app.get("/auth/github/callback", passport_1.default.authenticate("github", { session: false }), function (req, res) {
        res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    });
    app.get("/profile", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let userId = req.userId;
        const user = yield User_1.User.findOne(userId);
        const projects = yield (user === null || user === void 0 ? void 0 : user.projects);
        const teams = yield (user === null || user === void 0 ? void 0 : user.teams);
        const teamsIn = yield (user === null || user === void 0 ? void 0 : user.teamsIn);
        const me = teamsIn === null || teamsIn === void 0 ? void 0 : teamsIn.forEach((t) => __awaiter(void 0, void 0, void 0, function* () {
            return yield Team_1.Team.findOne(t.team_id);
        }));
        console.log(me);
        res.send({ user, projects, teams, teamsIn });
    }));
    app.get("/user-light", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let userId = req.userId;
        const user = yield User_1.User.findOne(userId, {
            select: ["id"],
        });
        res.send({ user });
    }));
    app.get("/users", isAuth_1.isAuth, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield User_1.User.find({
            order: { id: "DESC" },
        });
        res.send({ users });
    }));
    app.post("/user/details", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let userId = req.body.user_id;
        const user = yield User_1.User.findOne(userId);
        const projects = yield (user === null || user === void 0 ? void 0 : user.projects);
        const teams = yield (user === null || user === void 0 ? void 0 : user.teams);
        const teamsIn = yield (user === null || user === void 0 ? void 0 : user.teamsIn);
        res.send({ user, projects, teams, teamsIn });
    }));
    app.get("/users-light", isAuth_1.isAuth, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield User_1.User.find({
            order: { id: "DESC" },
        });
        res.send({ users });
    }));
    app.post("/flair/create", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const flairs = yield Flair_1.Flair.find({
            where: { user_id: req.userId },
        });
        const exists = yield Flair_1.Flair.findOne({
            where: [{ user_id: req.userId }, { name: req.body.name }],
        });
        if (req.body.name !== "" && flairs.length < 5) {
            if (exists == undefined) {
                res.send({ flair: null });
                return;
            }
            const flair = yield Flair_1.Flair.create({
                name: req.body.name,
                user_id: req.userId,
            }).save();
            res.send({ flair });
        }
        else {
            res.send({ flair: null });
            return;
        }
    }));
    app.post("/team/create", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.name !== "") {
            const team = yield Team_1.Team.create({
                name: req.body.name,
                description: req.body.desc,
                isPublic: req.body.visibility,
                user_id: req.userId,
                created_at: date_1.default().toString(),
                updated_at: date_1.default().toString(),
            }).save();
            res.send({ team });
        }
        else {
            res.send({ team: null });
            return;
        }
    }));
    app.get("/teams", isAuth_1.isAuth, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const teams = yield Team_1.Team.find({
            order: { id: "DESC" },
        });
        res.send({ teams });
    }));
    app.post("/project/create", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.name !== "") {
            const project = yield Project_1.Project
                .create({
                name: req.body.name,
                isPublic: req.body.visibility,
                user_id: req.body.team_id == null ? req.userId : null,
                team_id: req.body.team_id == null ? null : req.body.team_id,
                description: req.body.desc,
                created_at: date_1.default().toString(),
                updated_at: date_1.default().toString(),
            })
                .save();
            res.send({ project });
        }
        else {
            res.send({ project: null });
            return;
        }
    }));
    app.post("/team/add-user", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const exists = yield TeamMember_1.TeamMember.find({
            where: [
                {
                    user_id: req.body.user_id,
                    team_id: req.body.team_id,
                    status: typeorm_1.In(["accepted", "rejected"]),
                },
            ],
        });
        if (req.body.user_id !== "" && exists.length <= 0) {
            const teamMember = yield TeamMember_1.TeamMember.create({
                user_id: req.body.user_id,
                team_id: req.body.team_id,
                team_name: req.body.team_name,
                status: "pending",
                created_at: date_1.default().toString(),
                updated_at: date_1.default().toString(),
            }).save();
            res.send({ teamMember });
        }
        else {
            res.send({ teamMember: null });
            return;
        }
    }));
    app.post("/star/user", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const exists = yield Star_1.Star.findOne({
            where: [
                {
                    user_id: req.body.user_id,
                    liker_id: req.body.liker_id,
                },
            ],
        });
        if (req.body.user_id !== "" && req.body.liker_id !== "") {
            if (exists == undefined) {
                const star = yield Star_1.Star.create({
                    user_id: req.body.user_id,
                    liker_id: req.body.liker_id,
                    created_at: date_1.default().toString(),
                    updated_at: date_1.default().toString(),
                }).save();
                res.send({ star });
            }
            else {
                const star = yield Star_1.Star.delete(exists);
                res.send({ star, code: "D" });
            }
        }
        else {
            res.send({ star: null });
            return;
        }
    }));
    app.post("/star/user-status", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const star = yield Star_1.Star.findOne({
            where: [
                {
                    user_id: req.body.user_id,
                    liker_id: req.body.liker_id,
                },
            ],
        });
        if (star !== undefined) {
            res.send({ star });
        }
        else {
            res.send({ star: null });
            return;
        }
    }));
    app.get("/todo", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const todos = yield Todo_1.Todo.find({
            where: { creatorId: req.userId },
            order: { id: "DESC" },
        });
        res.send({ todos });
    }));
    app.post("/todo", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const todo = yield Todo_1.Todo.create({
            text: req.body.text,
            creatorId: req.userId,
        }).save();
        res.send({ todo });
    }));
    app.put("/todo", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const todo = yield Todo_1.Todo.findOne(req.body.id);
        if (!todo) {
            res.send({ todo: null });
            return;
        }
        if (todo.creatorId !== req.userId) {
            throw new Error("Not Authorized");
        }
        todo.completed = !todo.completed;
        yield todo.save();
        res.send({ todo });
    }));
    app.get("/", (_req, res) => {
        res.send("Hello");
    });
    app.listen(3002, () => {
        console.log("Listening on 3002");
    });
});
main();
//# sourceMappingURL=index.js.map