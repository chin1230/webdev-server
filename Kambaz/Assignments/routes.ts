import type { Express, Request, Response } from "express";
import type Database from "../Database";
import AssignmentsDao from "./dao";

export default function AssignmentRoutes(
  app: Express,
  db: typeof Database,
) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = (
    req: Request<{ courseId: string }>,
    res: Response,
  ) => {
    const { courseId } = req.params;

    res.json(dao.findAssignmentsForCourse(courseId));
  };

  const createAssignmentForCourse = (
    req: Request<{ courseId: string }>,
    res: Response,
  ) => {
    const created = dao.createAssignment({
      ...req.body,
      course: req.params.courseId,
    });

    res.json(created);
  };

  const updateAssignment = (
    req: Request<{ assignmentId: string }>,
    res: Response,
  ) => {
    const saved = dao.updateAssignment(
      req.params.assignmentId,
      req.body,
    );

    if (!saved) {
      res.status(404).json({
        message: "Assignment not found",
      });
      return;
    }

    res.json(saved);
  };

  const deleteAssignment = (
    req: Request<{ assignmentId: string }>,
    res: Response,
  ) => {
    dao.deleteAssignment(req.params.assignmentId);

    res.sendStatus(200);
  };

  app.get(
    "/api/courses/:courseId/assignments",
    findAssignmentsForCourse,
  );

  app.post(
    "/api/courses/:courseId/assignments",
    createAssignmentForCourse,
  );

  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}