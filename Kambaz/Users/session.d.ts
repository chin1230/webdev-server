import "express-session";
import type Database from "../Database";

type SessionUser = (typeof Database.users)[number] & {
  dob?: string;
};

declare module "express-session" {
  interface SessionData {
    currentUser?: SessionUser;
  }
}