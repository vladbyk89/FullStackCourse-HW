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
function renderGradeListXX(studentID) {
    return __awaiter(this, void 0, void 0, function* () {
        const editWindow = document.querySelector(".editWindow");
        const student = new Student('Vladi', studentID);
        const deleteGradeBtns = editWindow.querySelectorAll(".fa-square-minus");
        const deleteBtnsArr = Array.from(deleteGradeBtns);
        deleteGrade(deleteBtnsArr, student);
        const addGradeBtn = editWindow.querySelector("#addGradeBtn");
        const newGradeInput = editWindow.querySelector("#newGradeInput");
        newGradeInput.focus();
    });
}
function deleteGrade(btnsArr, studentToUpdate) {
    btnsArr.forEach((btn) => btn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        // const gradeIndex = btnsArr.indexOf(btn);
        // const listEle = btn.parentElement?.parentElement as HTMLDataListElement;
        // listEle.remove();
        // const grade = studentToUpdate.grades.splice(gradeIndex, 1);
        // await fetch(`${studentApi}/${studentToUpdate._id}`, {
        //   method: "PATCH",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ grade, gradeIndex, delete: true }),
        // }).catch((error) => console.error(error));
        // displayStudents();
    })));
}
