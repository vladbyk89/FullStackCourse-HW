import express from "express";
const studentRouter = express.Router();
import {
  getAllStudents,
  getStudent,
  getStudentsInCourse,
  createStudent,
  deleteStudent,
  updateStudent,
} from "../controllers/studentController";

studentRouter.route("/").get(getAllStudents).post(createStudent);

studentRouter
  .route("/:studentId")
  .get(getStudent)
  .patch(updateStudent)
  .delete(deleteStudent);
  
studentRouter.route("/inCourse/:courseId").get(getStudentsInCourse);

// module.exports = studentRouter;
export { studentRouter };
