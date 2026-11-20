import "dotenv/config";
import express from "express";
import cors from "cors";
import session, { type SessionOptions } from "express-session";
import Hello from "./Hello";
import Lab5 from "./Lab5/index";
import db from "./Kambaz/Database";
import UserRoutes from "./Kambaz/Users/routes";
import CourseRoutes from "./Kambaz/Courses/routes";
import ModuleRoutes from "./Kambaz/Modules/routes";

const app = express();

const isProduction = process.env.SERVER_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required");
}

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  }),
);

const sessionOptions: SessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  },
};

if (isProduction) {
  sessionOptions.proxy = true;
}

app.use(session(sessionOptions));
app.use(express.json());

Lab5(app);
Hello(app);
UserRoutes(app, db);
CourseRoutes(app, db);
ModuleRoutes(app, db);

app.listen(process.env.PORT || 4000);