import Student from "../models/StudentModel";
import Course from "../models/CourseModel";
import { NextFunction, Response, Request } from "express";

export const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await Student.find({});
    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
  }
};

export const getStudentsInCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById({ _id: courseId });
    const students = await Student.find({ courses: course });
    res.status(200).send({ students });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, courseId } = req.body;
    const course = await Course.findById(courseId);
    const student = await Student.create({ name, courses: [course] });
    // const students = await Student.find({});
    res.status(200).json({ student });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

export const getStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: studentId } = req.params;
    const student = await Student.findById(studentId);
    res.status(200).json({ student });
  } catch (error) {
    console.error(error);
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: studentId } = req.params;
    const student = await Student.deleteOne({ _id: studentId });
    const students = await Student.find({});

    res.status(200).send({ students });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const { newName } = req.body;
    await Student.findByIdAndUpdate(studentId, {
      name: newName,
    });
    const student = await Student.findById(studentId);
    res.status(201).json({ student });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
