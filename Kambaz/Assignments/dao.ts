import { v4 as uuidv4 } from "uuid";
import type Database from "../Database";

type Assignment = (typeof Database.assignments)[number];

export default function AssignmentsDao(db: typeof Database) {
  function findAssignmentsForCourse(courseId: string) {
    return db.assignments.filter(
      (assignment) => assignment.course === courseId,
    );
  }

  function createAssignment(assignment: Omit<Assignment, "_id">) {
    const created = {
      ...assignment,
      _id: uuidv4(),
    };

    db.assignments = [...db.assignments, created];

    return created;
  }

  function updateAssignment(
    assignmentId: string,
    updates: Partial<Assignment>,
  ) {
    const assignment = db.assignments.find(
      (item) => item._id === assignmentId,
    );

    if (!assignment) {
      return null;
    }

    Object.assign(assignment, updates, {
      _id: assignmentId,
      course: assignment.course,
    });

    return assignment;
  }

  function deleteAssignment(assignmentId: string) {
    db.assignments = db.assignments.filter(
      (item) => item._id !== assignmentId,
    );
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}