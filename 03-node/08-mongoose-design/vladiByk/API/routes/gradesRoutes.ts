import express from "express";
const gradeRouter = express.Router();
import {
  getAllGrades,
  getStudentGradesInCourse,
  createGrade,
  deleteGrade,
  updateGrade,
} from "../controllers/gradeController";

gradeRouter.route("/").get(getAllGrades).post(createGrade);
gradeRouter.route("/:id").get(getStudentGradesInCourse).patch(updateGrade).delete(deleteGrade);

// module.exports = gradeRouter;
export { gradeRouter };
