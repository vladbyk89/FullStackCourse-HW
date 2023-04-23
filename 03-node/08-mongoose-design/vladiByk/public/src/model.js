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
class Teacher {
    constructor(name) {
        this.name = name;
    }
}
class Student {
    constructor(name, id = "") {
        this.name = name;
        this.id = id;
    }
}
class Course {
    constructor(name, teachers = [], id) {
        this.name = name;
        this.teachers = teachers;
        this.id = id;
    }
    getStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield fetch("/api/v1/students").then;
            return "student list";
        });
    }
}
class Grade {
    constructor(score, course, student) {
        this.score = score;
        this.course = course;
        this.student = student;
    }
}
