import mongoose, { Schema } from "mongoose";
import { StudentSchema } from "./StudentModel";
import { CourseSchema } from "./CourseModel";

interface Grade {
  score: string;
  _id: string;
}

export const GradeSchema: Schema = new Schema(
  {
    score: Number,
    course: CourseSchema,
    student: StudentSchema,
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<Grade>("Grade", GradeSchema);
