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
        const student = yield fetch(`${studentApi}/${studentID}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then(({ student }) => new Student(student.name, student.id))
            .catch((error) => console.error(error));
        if (!student)
            return;
        const editGradeBtns = editWindow.querySelectorAll(".fa-pen");
        const editBtnsArr = Array.from(editGradeBtns);
        editGradeBtnEvent(editBtnsArr, student);
        const deleteGradeBtns = editWindow.querySelectorAll(".fa-square-minus");
        const deleteBtnsArr = Array.from(deleteGradeBtns);
        deleteGrade(deleteBtnsArr, student);
        const addGradeBtn = editWindow.querySelector("#addGradeBtn");
        const newGradeInput = editWindow.querySelector("#newGradeInput");
        addGrade(addGradeBtn, newGradeInput, student);
        newGradeInput.focus();
    });
}
function editGradeBtnEvent(btnArr, student) {
    btnArr.forEach((btn) => btn.addEventListener("click", () => {
        var _a;
        const gradeIndex = btnArr.indexOf(btn);
        const listEle = (_a = btn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        const iconDiv = listEle.querySelector(".listIcons");
        const spanEle = listEle.firstElementChild;
        const inputEle = document.createElement("input");
        inputEle.setAttribute("type", "number");
        inputEle.value = spanEle.innerHTML;
        listEle.replaceChild(inputEle, spanEle);
        inputEle.focus();
        iconDiv.style.display = "none";
        inputEle.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                if (Number(inputEle.value) > 100 ||
                    Number(inputEle.value) < 0 ||
                    !Number(inputEle.value))
                    return alert("Check grade input");
                spanEle.textContent = inputEle.value;
                listEle.replaceChild(spanEle, inputEle);
                iconDiv.style.display = "flex";
            }
        });
    }));
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
function addGrade(btn, newGradeInput, student) {
    btn.addEventListener("click", () => {
        updateGrade(newGradeInput, student.id);
    });
    newGradeInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            updateGrade(newGradeInput, student.id);
        }
    });
}
function updateGrade(input, studentID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Number(input.value) > 100 ||
            Number(input.value) < 0 ||
            !Number(input.value))
            return alert("Check grade input");
        yield fetch(`${studentApi}/${studentID}`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ grade: input.value, delete: false }),
        }).catch((error) => console.error(error));
        renderGradeListXX(studentID);
        // displayStudents();
        input.value = "";
    });
}
// window.addEventListener("click", (e: Event) => {
//   const target = e.target as HTMLElement;
//   if (target.id === "closeEditWindow") {
//     editWindow.style.display = "none";
//   }
//   if (target.classList.contains("fa-pen-to-square")) {
//     const id = target.parentElement?.parentElement?.id as string;
//     openEditWindow(id);
//   }
// });
