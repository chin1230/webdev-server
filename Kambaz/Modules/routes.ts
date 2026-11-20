import type { Express, Request, Response } from "express";
import type Database from "../Database";
import ModulesDao from "./dao";

export default function ModuleRoutes(
  app: Express,
  db: typeof Database,
) {
  const dao = ModulesDao(db);

  const findModulesForCourse = (
    req: Request<{ courseId: string }>,
    res: Response,
  ) => {
    const { courseId } = req.params;

    res.json(dao.findModulesForCourse(courseId));
  };

  const createModuleForCourse = (
    req: Request<{ courseId: string }>,
    res: Response,
  ) => {
    const { courseId } = req.params;

    const module = {
      description: "",
      lessons: [],
      ...req.body,
      course: courseId,
    };

    const newModule = dao.createModule(module);

    res.json(newModule);
  };

  const deleteModule = (
    req: Request<{ moduleId: string }>,
    res: Response,
  ) => {
    const { moduleId } = req.params;

    dao.deleteModule(moduleId);

    res.sendStatus(200);
  };

  const updateModule = (
    req: Request<{ moduleId: string }>,
    res: Response,
  ) => {
    const { moduleId } = req.params;
    const saved = dao.updateModule(moduleId, req.body);

    if (!saved) {
      res.status(404).json({
        message: "Module not found",
      });
      return;
    }

    res.json(saved);
  };

  app.get(
    "/api/courses/:courseId/modules",
    findModulesForCourse,
  );

  app.post(
    "/api/courses/:courseId/modules",
    createModuleForCourse,
  );

  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
}