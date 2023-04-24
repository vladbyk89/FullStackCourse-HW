"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudent = exports.deleteStudent = exports.getStudent = exports.createStudent = exports.getStudentsInCourse = exports.getAllStudents = void 0;
const StudentModel_1 = __importDefault(require("../models/StudentModel"));
const CourseModel_1 = __importDefault(require("../models/CourseModel"));
const getAllStudents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield StudentModel_1.default.find({});
        res.status(200).json({ students });
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllStudents = getAllStudents;
const getStudentsInCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const course = yield CourseModel_1.default.findById({ _id: courseId });
        const students = yield StudentModel_1.default.find({ courses: course });
        res.status(200).send({ students });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});
exports.getStudentsInCourse = getStudentsInCourse;
const createStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, courseId } = req.body;
        const course = yield CourseModel_1.default.findById(courseId);
        const student = yield StudentModel_1.default.create({ name, courses: [course] });
        // const students = await Student.find({});
        res.status(200).json({ student });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});
exports.createStudent = createStudent;
const getStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: studentId } = req.params;
        const student = yield StudentModel_1.default.findById(studentId);
        res.status(200).json({ student });
    }
    catch (error) {
        console.error(error);
    }
});
exports.getStudent = getStudent;
const deleteStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: studentId } = req.params;
        const student = yield StudentModel_1.default.deleteOne({ _id: studentId });
        const students = yield StudentModel_1.default.find({});
        res.status(200).send({ students });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
exports.deleteStudent = deleteStudent;
const updateStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: studentId } = req.params;
        const student = yield StudentModel_1.default.findById({ _id: studentId });
        res.status(201).json({ student });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});
exports.updateStudent = updateStudent;
