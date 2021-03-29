import "reflect-metadata";
require("dotenv-safe").config();
import express from "express";
import { join } from "path";
import { createConnection, In } from "typeorm";
import { _prod_ } from "./constants";

import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import { User } from "./entities/User";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Todo } from "./entities/Todo";
import { isAuth } from "./isAuth";
import getDate from "./utils/date";
import { Flair } from "./entities/Flair";
import { Team } from "./entities/Team";
import { Project } from "./entities/Project";
import { TeamMember } from "./entities/TeamMember";
import { Star } from "./entities/Star";

const main = async () => {
  await createConnection({
    type: "mysql",
    host: "127.0.0.1",
    username: "root",
    password: "",
    database: "codebooth",
    entities: [join(__dirname, "./entities/*.*")],
    logging: true,
    synchronize: true,
    charset: "utf8mb4_unicode_ci",
  }).catch((err) => {
    console.log(err);
  });

  const app = express();

  passport.serializeUser(function (user: any, done) {
    done(null, user.accessToken);
  });

  app.use(cors({ origin: "*" }));
  app.use(passport.initialize());
  app.use(express.json());

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback",
      },
      async function (_, __, profile, cb) {
        const payload: any = profile._json;
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
          user.name = payload.name;
          user.image = payload.avatar_url;
          user.updated_at = getDate().toString();
          user.save();
        } else {
          user = await User.create({
            name: payload.name,
            email: payload.email,
            githubId: payload.id,
            image: payload.avatar_url,
            github_url: payload.html_url,
            company: payload.company,
            location: payload.location,
            bio: payload.bio.toString(),
            created_at: getDate().toString(),
            updated_at: getDate().toString(),
          }).save();
        }

        cb(null, {
          accessToken: jwt.sign({ userId: user.id }, process.env.SECRET, {
            expiresIn: "1y",
          }),
        });
      }
    )
  );

  app.get("/auth/github", passport.authenticate("github", { session: false }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    function (req: any, res) {
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );

  /* ------------------ Profile Details of the Logged In User ----------------- */
  app.get("/profile", isAuth, async (req, res) => {
    let userId = req.userId;

    const user = await User.findOne(userId);

    const projects = await user?.projects;
    const teams = await user?.teams;
    const teamsIn = await user?.teamsIn;

    const me = teamsIn?.forEach(async (t) => {
      return await Team.findOne(t.team_id);
    });

    console.log(me);

    res.send({ user, projects, teams, teamsIn });
  });

  /* ------------------ Light Details of the Logged In User ----------------- */
  app.get("/user-light", isAuth, async (req, res) => {
    let userId = req.userId;

    const user = await User.findOne(userId, {
      select: ["id"],
    });

    res.send({ user });
  });

  /* ------------------- Fetch All users of the Application ------------------- */
  app.get("/users", isAuth, async (_req, res) => {
    const users = await User.find({
      order: { id: "DESC" },
    });

    // const users: User[] = users_.sort(() => Math.random() - 0.5);

    res.send({ users });
  });

  /* ------------------- Fetch Additional Details of a user------------------- */
  app.post("/user/details", isAuth, async (req, res) => {
    let userId = req.body.user_id;

    const user = await User.findOne(userId);

    const projects = await user?.projects;
    const teams = await user?.teams;
    const teamsIn = await user?.teamsIn;

    res.send({ user, projects, teams, teamsIn });
  });

  /* ------------------- Fetch All users of the Application [Dropdown] ------------------- */
  app.get("/users-light", isAuth, async (_req, res) => {
    const users = await User.find({
      order: { id: "DESC" },
    });
    res.send({ users });
  });

  /* --------------------------- Create a new Flair --------------------------- */
  app.post("/flair/create", isAuth, async (req, res) => {
    const flairs = await Flair.find({
      where: { user_id: req.userId },
    });
    const exists = await Flair.findOne({
      where: [{ user_id: req.userId }, { name: req.body.name }],
    });

    if (req.body.name !== "" && flairs.length < 5) {
      if (exists == undefined) {
        res.send({ flair: null });
        return;
      }
      const flair = await Flair.create({
        name: req.body.name,
        user_id: req.userId,
      }).save();
      res.send({ flair });
    } else {
      res.send({ flair: null });
      return;
    }
  });

  /* --------------------------- Create a new Team --------------------------- */
  app.post("/team/create", isAuth, async (req, res) => {
    if (req.body.name !== "") {
      const team = await Team.create({
        name: req.body.name,
        description: req.body.desc,
        isPublic: req.body.visibility,
        user_id: req.userId,
        created_at: getDate().toString(),
        updated_at: getDate().toString(),
      }).save();
      res.send({ team });
    } else {
      res.send({ team: null });
      return;
    }
  });

  /* ------------------- Fetch All teams of the Application ------------------- */
  app.get("/teams", isAuth, async (_req, res) => {
    const teams = await Team.find({
      order: { id: "DESC" },
    });

    res.send({ teams });
  });

  /* --------------------------- Create a new Project --------------------------- */
  app.post("/project/create", isAuth, async (req, res) => {
    if (req.body.name !== "") {
      const project = await (Project as any)
        .create({
          name: req.body.name,
          isPublic: req.body.visibility,
          user_id: req.body.team_id == null ? req.userId : null,
          team_id: req.body.team_id == null ? null : req.body.team_id,
          description: req.body.desc,
          created_at: getDate().toString(),
          updated_at: getDate().toString(),
        })
        .save();
      res.send({ project });
    } else {
      res.send({ project: null });
      return;
    }
  });

  /* --------------------------- Add user to Team --------------------------- */
  app.post("/team/add-user", isAuth, async (req, res) => {
    const exists = await TeamMember.find({
      where: [
        {
          user_id: req.body.user_id,
          team_id: req.body.team_id,
          status: In(["accepted", "rejected"]),
        },
      ],
    });
    if (req.body.user_id !== "" && exists.length <= 0) {
      const teamMember = await TeamMember.create({
        user_id: req.body.user_id,
        team_id: req.body.team_id,
        team_name: req.body.team_name,
        status: "pending",
        created_at: getDate().toString(),
        updated_at: getDate().toString(),
      }).save();
      res.send({ teamMember });
    } else {
      res.send({ teamMember: null });
      return;
    }
  });

  /* ---------------------------Star User --------------------------- */
  app.post("/star/user", isAuth, async (req, res) => {
    const exists = await Star.findOne({
      where: [
        {
          user_id: req.body.user_id,
          liker_id: req.body.liker_id,
        },
      ],
    });
    if (req.body.user_id !== "" && req.body.liker_id !== "") {
      if (exists == undefined) {
        const star = await Star.create({
          user_id: req.body.user_id,
          liker_id: req.body.liker_id,
          created_at: getDate().toString(),
          updated_at: getDate().toString(),
        }).save();
        res.send({ star });
      } else {
        const star = await Star.delete(exists);
        res.send({ star, code: "D" });
      }
    } else {
      res.send({ star: null });
      return;
    }
  });

  /* ---------------------------Star User Status --------------------------- */
  app.post("/star/user-status", isAuth, async (req, res) => {
    const star = await Star.findOne({
      where: [
        {
          user_id: req.body.user_id,
          liker_id: req.body.liker_id,
        },
      ],
    });

    if (star !== undefined) {
      res.send({ star });
    } else {
      res.send({ star: null });
      return;
    }
  });

  // UNLOOKED

  app.get("/todo", isAuth, async (req, res) => {
    const todos = await Todo.find({
      where: { creatorId: req.userId },
      order: { id: "DESC" },
    });
    res.send({ todos });
  });

  app.post("/todo", isAuth, async (req, res) => {
    console.log(req.body);
    const todo = await Todo.create({
      text: req.body.text,
      creatorId: req.userId,
    }).save();
    res.send({ todo });
  });

  app.put("/todo", isAuth, async (req, res) => {
    const todo = await Todo.findOne(req.body.id);
    if (!todo) {
      res.send({ todo: null });
      return;
    }
    if (todo.creatorId !== req.userId) {
      throw new Error("Not Authorized");
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.send({ todo });
  });

  app.get("/", (_req, res) => {
    res.send("Hello");
  });

  app.listen(3002, () => {
    console.log("Listening on 3002");
  });
};

main();
