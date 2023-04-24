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
function createStudent(studentName, courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdStudent = yield fetch(`${studentApi}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: studentName, courseId }),
        })
            .then((res) => res.json())
            .then(({ student }) => student)
            .catch((error) => console.error(error));
        return createdStudent;
    });
}
function createGrade(score, courseId, studentId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`${gradesApi}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                score,
                courseId,
                studentId: studentId,
            }),
        }).catch((error) => console.error(error));
    });
}
