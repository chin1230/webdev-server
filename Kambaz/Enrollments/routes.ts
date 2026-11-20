import type { Express, Request, Response } from "express";
import type Database from "../Database";
import EnrollmentsDao from "./dao";

type EnrollmentRequest = Request<{
  userId: string;
  courseId: string;
}>;

export default function EnrollmentRoutes(
  app: Express,
  db: typeof Database,
) {
  const dao = EnrollmentsDao(db);

  const getCurrentUserId = (
    req: EnrollmentRequest,
    res: Response,
  ) => {
    const currentUser = req.session.currentUser;

    if (!currentUser) {
      res.status(401).json({
        message: "Please sign in first",
      });
      return null;
    }

    if (
      req.params.userId !== "current" &&
      req.params.userId !== currentUser._id
    ) {
      res.status(403).json({
        message: "You can only change your own enrollments",
      });
      return null;
    }

    return currentUser._id;
  };

  const enrollIntoCourse = (
    req: EnrollmentRequest,
    res: Response,
  ) => {
    const userId = getCurrentUserId(req, res);

    if (!userId) {
      return;
    }

    const { courseId } = req.params;

    if (!db.courses.some((course) => course._id === courseId)) {
      res.status(404).json({
        message: "Course not found",
      });
      return;
    }

    res.json(dao.enrollUserInCourse(userId, courseId));
  };

  const unenrollFromCourse = (
    req: EnrollmentRequest,
    res: Response,
  ) => {
    const userId = getCurrentUserId(req, res);

    if (!userId) {
      return;
    }

    dao.unenrollUserFromCourse(
      userId,
      req.params.courseId,
    );

    res.sendStatus(200);
  };

  app.post(
    "/api/users/:userId/courses/:courseId",
    enrollIntoCourse,
  );

  app.delete(
    "/api/users/:userId/courses/:courseId",
    unenrollFromCourse,
  );
}