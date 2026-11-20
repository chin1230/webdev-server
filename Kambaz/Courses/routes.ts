import type { Express, Request, Response } from "express";
import type Database from "../Database";
import CoursesDao from "./dao";
import EnrollmentsDao from "../Enrollments/dao";

export default function CourseRoutes(
  app: Express,
  db: typeof Database,
) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findAllCourses = (req: Request, res: Response) => {
    res.json(dao.findAllCourses());
  };

  const findCoursesForEnrolledUser = (
    req: Request<{ userId: string }>,
    res: Response,
  ) => {
    let { userId } = req.params;

    if (userId === "current") {
      const currentUser = req.session.currentUser;

      if (!currentUser) {
        res.sendStatus(401);
        return;
      }

      userId = currentUser._id;
    }

    res.json(dao.findCoursesForEnrolledUser(userId));
  };

  const createCourse = (req: Request, res: Response) => {
    const currentUser = req.session.currentUser;

    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const newCourse = dao.createCourse(req.body);

    enrollmentsDao.enrollUserInCourse(
      currentUser._id,
      newCourse._id,
    );

    res.json(newCourse);
  };

  const deleteCourse = (
    req: Request<{ courseId: string }>,
    res: Response,
  ) => {
    const { courseId } = req.params;

    dao.deleteCourse(courseId);

    res.sendStatus(200);
  };

  const updateCourse = (
    req: Request<{ courseId: string }>,
    res: Response,
  ) => {
    const { courseId } = req.params;
    const saved = dao.updateCourse(courseId, req.body);

    if (!saved) {
      res.status(404).json({
        message: "Course not found",
      });
      return;
    }

    res.json(saved);
  };

  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/current/courses", createCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
}