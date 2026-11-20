import { v4 as uuidv4 } from "uuid";
import type Database from "../Database";

type User = (typeof Database.users)[number] & {
  dob?: string;
};

export default function UsersDao(db: typeof Database) {
  const createUser = (user: {
    username: string;
    password: string;
  }) => {
    const newUser: User = {
      _id: uuidv4(),
      username: user.username,
      password: user.password,
      firstName: "",
      lastName: "",
      email: "",
      role: "STUDENT",
      loginId: "",
      section: "",
      lastActivity: "",
      totalActivity: "",
    };

    db.users.push(newUser);

    return newUser;
  };

  const findUserByUsername = (username: string) =>
    db.users.find((user) => user.username === username);

  const findUserByCredentials = (
    username: string,
    password: string,
  ) =>
    db.users.find(
      (user) =>
        user.username === username &&
        user.password === password,
    );

  const findUserById = (userId: string) =>
    db.users.find((user) => user._id === userId);

  const updateUser = (userId: string, user: Partial<User>) => {
    db.users = db.users.map((existingUser) =>
      existingUser._id === userId
        ? { ...existingUser, ...user, _id: existingUser._id }
        : existingUser,
    );
  };

  return {
    createUser,
    findUserById,
    updateUser,
    findUserByUsername,
    findUserByCredentials,
  };
}