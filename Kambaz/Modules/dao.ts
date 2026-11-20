import { v4 as uuidv4 } from "uuid";
import type Database from "../Database";

type CourseModule = (typeof Database.modules)[number];

export default function ModulesDao(db: typeof Database) {
  function findModulesForCourse(courseId: string) {
    const { modules } = db;

    return modules.filter(
      (module) => module.course === courseId,
    );
  }

  function createModule(module: Omit<CourseModule, "_id">) {
    const newModule = {
      ...module,
      _id: uuidv4(),
    };

    db.modules = [...db.modules, newModule];

    return newModule;
  }

  function deleteModule(moduleId: string) {
    const { modules } = db;

    db.modules = modules.filter(
      (module) => module._id !== moduleId,
    );
  }

  function updateModule(
    moduleId: string,
    moduleUpdates: Partial<CourseModule>,
  ) {
    const module = db.modules.find(
      (module) => module._id === moduleId,
    );

    if (!module) {
      return null;
    }

    Object.assign(module, moduleUpdates, {
      _id: moduleId,
      course: module.course,
    });

    return module;
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}