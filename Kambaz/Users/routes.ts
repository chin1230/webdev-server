import type { Express, Request, Response } from "express";
import type Database from "../Database";
import UsersDao from "./dao";

type User = (typeof Database.users)[number];

export default function UserRoutes(
  app: Express,
  db: typeof Database,
) {
  const dao = UsersDao(db);

  const startSession = (
    req: Request,
    res: Response,
    user: User,
  ) => {
    req.session.regenerate((error) => {
      if (error) {
        res.status(500).json({
          message: "Unable to create session",
        });
        return;
      }

      req.session.currentUser = user;
      res.json(user);
    });
  };

  const signup = (req: Request, res: Response) => {
    const { username, password } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      res.status(400).json({
        message: "Username and password are required",
      });
      return;
    }

    const name = username.trim();
    const existingUser = dao.findUserByUsername(name);

    if (existingUser) {
      res.status(400).json({
        message: "Username already in use",
      });
      return;
    }

    const user = dao.createUser({
      username: name,
      password,
    });

    startSession(req, res, user);
  };

  const signin = (req: Request, res: Response) => {
    const { username, password } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      res.status(400).json({
        message: "Username and password are required",
      });
      return;
    }

    const user = dao.findUserByCredentials(
      username.trim(),
      password,
    );

    if (!user) {
      res.status(401).json({
        message: "Invalid username or password",
      });
      return;
    }

    startSession(req, res, user);
  };

  const updateUser = (
    req: Request<{ userId: string }>,
    res: Response,
  ) => {
    const { userId } = req.params;
    const sessionUser = req.session.currentUser;

    if (!sessionUser) {
      res.status(401).json({
        message: "Not signed in",
      });
      return;
    }

    if (sessionUser._id !== userId) {
      res.status(403).json({
        message: "You can only update your own profile",
      });
      return;
    }

    const existingUser = dao.findUserById(userId);

    if (!existingUser) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const userUpdates = req.body ?? {};
    const { username, password } = userUpdates;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      res.status(400).json({
        message: "Username and password are required",
      });
      return;
    }

    const name = username.trim();
    const userWithSameName = dao.findUserByUsername(name);

    if (userWithSameName && userWithSameName._id !== userId) {
      res.status(400).json({
        message: "Username already in use",
      });
      return;
    }

    dao.updateUser(userId, {
      ...userUpdates,
      username: name,
    });

    const updatedUser = dao.findUserById(userId);

    req.session.currentUser = updatedUser;
    res.json(updatedUser);
  };

  const profile = (req: Request, res: Response) => {
    const currentUser = req.session.currentUser;

    if (!currentUser) {
      res.status(401).json({
        message: "Not signed in",
      });
      return;
    }

    res.json(currentUser);
  };

  const signout = (req: Request, res: Response) => {
    req.session.destroy((error) => {
      if (error) {
        res.status(500).json({
          message: "Unable to sign out",
        });
        return;
      }

      res.clearCookie("connect.sid", { path: "/" });
      res.sendStatus(200);
    });
  };

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.put("/api/users/:userId", updateUser);
  app.get("/api/users/profile", profile);
}