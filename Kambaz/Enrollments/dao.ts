import { v4 as uuidv4 } from "uuid";
import type Database from "../Database";

export default function EnrollmentsDao(db: typeof Database) {
  function enrollUserInCourse(userId: string, courseId: string) {
    db.enrollments.push({
      _id: uuidv4(),
      user: userId,
      course: courseId,
    });
  }

  return { enrollUserInCourse };
}