import express from "express";
const courseRouter = express.Router();
import {
  getAllCourses,
  getTeacherCourses,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/courseController";

courseRouter.route("/").get(getAllCourses).post(createCourse);

courseRouter
  .route("/:id")
  .get(getTeacherCourses)
  .patch(updateCourse)
  .delete(deleteCourse);

export { courseRouter };
