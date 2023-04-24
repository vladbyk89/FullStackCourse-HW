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
function renderTeacherLogin() {
    root.innerHTML = `
    <h1>Teacher login page</h1>
    <form id="teacherLoginForm">
      <label for="teacherId"
        >Teacher ID:
        <input
          type="text"
          name="teacherId"
          id="teacherId"
          placeholder="Fdgg23fWe34..."
      /></label>
      <button type="submit">Enter</button>
    </form>`;
    const teacherLoginForm = document.querySelector("#teacherLoginForm");
    const teacherIdInput = document.querySelector("#teacherId");
    teacherLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        checkTeacherId(teacherIdInput.value);
        teacherIdInput.value = "";
    });
}
function checkTeacherId(teacherId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const teacher = yield fetch(`${teacherApi}/${teacherId}`)
                .then((res) => res.json())
                .then(({ teacher }) => teacher)
                .catch((error) => console.error(error));
            if (!teacher)
                throw new Error("Teacher not found!");
            console.log(teacher);
            renderCoursePage(teacher._id);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function renderCoursePage(teacherId) {
    return __awaiter(this, void 0, void 0, function* () {
        const courses = yield fetch(`${courseApi}/${teacherId}`)
            .then((res) => res.json())
            .then(({ courses }) => courses)
            .catch((error) => console.error(error));
        root.innerHTML = `
    <h1>Available courses</h1>
    <div id="coursesRoot">
    </div>
    <form id="addCourseForm">
      <label for="courseName">
        <input
          type="text"
          name="courseName"
          id="courseName"
          placeholder="Astrophysics..."
        />
      </label>
      <button type="submit">Add</button>
    </form>
    `;
        renderCoursesRoot(courses);
        const addCourseForm = root.querySelector("#addCourseForm");
        addCourseForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const courseName = addCourseForm.courseName.value;
            console.log(courseName);
            addCourse(courseName, teacherId);
        });
        const coursesBtn = root.querySelectorAll(".course");
        coursesBtn.forEach((btn) => btn.addEventListener("click", () => {
            displayStudents(btn.id);
        }));
    });
}
function addCourse(courseName, teacherId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`${courseApi}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseName, teacherId }),
        }).catch((error) => console.error(error));
        renderCoursePage(teacherId);
    });
}
function renderCoursesRoot(coursesList) {
    const coursesRoot = document.querySelector("#coursesRoot");
    coursesRoot.innerHTML = coursesList
        .map((course) => `<button class="course" id="${course._id}">${course.name}</button>`)
        .join("");
}
function renderStudentsPage(studentsRootHtml, courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            root.innerHTML = `
      <h1>Student list</h1>
      <div id="studentsRoot">
        ${studentsRootHtml}
      </div>
      <h4>Add student</h4>
      <form id="addStudentForm">
          <label for="name"
          >Full name:
          <input type="text" name="fullName" id="name" placeholder="John Doe" required
          /></label>
          <label for="grade"
          >Grade: <input type="number" name="grade" id="grade" placeholder="88" min="0" max="100" required
          /></label>
          <button type="submit">Add</button>
      </form>
      <div class="editWindow"></div>
    `;
            const addStudentForm = root.querySelector("#addStudentForm");
            addStudentForm.addEventListener("submit", (e) => {
                e.preventDefault();
                handleAddStudentForm(addStudentForm, courseId);
            });
            activateDeleteButtons();
            activateEditButtons(courseId);
        }
        catch (error) {
            console.log(error);
        }
    });
}
const displayStudents = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let studentsRootHtml = " ";
        yield fetch(`${studentApi}/inCourse/${courseId}`)
            .then((res) => res.json())
            .then(({ students }) => students.forEach((student) => __awaiter(void 0, void 0, void 0, function* () {
            const newStudent = new Student(student.name, student._id, courseId);
            const studentAvgScore = yield newStudent.getAverageInCourse(courseId);
            studentsRootHtml += `
          <div class="studentDiv" id="${student._id}">
              <b>${student.name}</b>
              <span>${studentAvgScore}</span>
              <div class="crudIcons">
                <i class="fa-regular fa-trash-can"></i>
                <i class="fa-regular fa-pen-to-square"></i>
              </div>
          </div>`;
            renderStudentsPage(studentsRootHtml, courseId);
        })))
            .catch((error) => console.log(error));
    }
    catch (error) {
        console.error(error);
    }
});
function handleAddStudentForm(addStudentForm, courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const newStudentName = addStudentForm.fullName.value;
        const newStudentGrade = addStudentForm.grade.value;
        const createdStudent = yield fetch(`${studentApi}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newStudentName, courseId }),
        })
            .then((res) => res.json())
            .then(({ student }) => student)
            .catch((error) => console.error(error));
        const createdGrade = yield fetch(`${gradesApi}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                score: parseInt(newStudentGrade),
                courseId,
                studentId: createdStudent._id,
            }),
        })
            .then((res) => res.json())
            .then(({ grade }) => grade)
            .catch((error) => console.error(error));
        displayStudents(courseId);
    });
}
function activateDeleteButtons() {
    try {
        const deleteButtons = document.querySelectorAll(".fa-trash-can");
        deleteButtons.forEach((btn) => btn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const studentDiv = (_a = btn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
            const id = studentDiv.id;
            studentDiv.remove();
            yield fetch(`${studentApi}/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).catch((error) => console.error(error));
        })));
    }
    catch (error) {
        console.log(error);
    }
}
function activateEditButtons(courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const editButtons = root.querySelectorAll(".fa-pen-to-square");
        editButtons.forEach((btn) => btn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const studentId = (_b = (_a = btn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.id;
            const grades = yield fetch(`${gradesApi}/${studentId}?courseId=${courseId}`)
                .then((res) => res.json())
                .then(({ grades }) => grades)
                .catch((error) => console.error(error));
            renderGradeList(grades);
        })));
    });
}
function renderGradeList(gradeList) {
    const studentName = gradeList[0].student.name;
    const studentId = gradeList[0].student._id;
    const courseId = gradeList[0].course._id;
    const editWindow = document.querySelector(".editWindow");
    const listItemsHtml = gradeList
        .map((grade) => `<li id="${grade._id}">
    <span>${grade.score}</span>
    <div class="listIcons">
      <i class="fa-regular fa-square-minus"></i>
      <i class="fa-solid fa-pen"></i>
    </div>
  </li>`)
        .join("");
    editWindow.innerHTML = `
      <h2>${studentName}</h2>
      <ul class="gradesList" id="${courseId}">
          <div><b>Grades</b><b>Edit</b></div>
        ${listItemsHtml}
      </ul>
      <label for="newGrade">
        <input type="number" id="newGradeInput" placeholder="New grade..." />
        <input type="submit" id="addGradeBtn"/>
      </label>
      <button id="closeEditWindow">Done</button>
    `;
    editWindow.style.display = "flex";
    const closeEditWindowBtn = root.querySelector("#closeEditWindow");
    closeEditWindowBtn.addEventListener("click", () => {
        displayStudents(courseId);
        editWindow.style.display = "none";
    });
    activateEditGradeButtons();
    activateDeleteGradeBtn();
    activateAddGrade(courseId, studentId);
}
function activateEditGradeButtons() {
    const editGradeBtns = root.querySelectorAll(".fa-pen");
    editGradeBtns.forEach((btn) => btn.addEventListener("click", () => {
        var _a;
        const listEle = (_a = btn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        const gradeId = listEle.id;
        const iconDiv = listEle.querySelector(".listIcons");
        const spanEle = listEle.firstElementChild;
        const gradeInputEle = document.createElement("input");
        gradeInputEle.setAttribute("type", "number");
        gradeInputEle.value = spanEle.innerHTML;
        listEle.replaceChild(gradeInputEle, spanEle);
        gradeInputEle.focus();
        iconDiv.style.display = "none";
        gradeInputEle.addEventListener("keyup", (e) => __awaiter(this, void 0, void 0, function* () {
            if (e.key === "Enter") {
                if (Number(gradeInputEle.value) > 100 ||
                    Number(gradeInputEle.value) < 0 ||
                    !Number(gradeInputEle.value))
                    return alert("Check grade input");
                spanEle.textContent = gradeInputEle.value;
                listEle.replaceChild(spanEle, gradeInputEle);
                iconDiv.style.display = "flex";
                const updatedGrade = yield fetch(`${gradesApi}/${gradeId}`, {
                    method: "PATCH",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newScore: parseInt(gradeInputEle.value),
                    }),
                })
                    .then((res) => res.json())
                    .then(({ grade }) => grade)
                    .catch((error) => console.error(error));
                const courseId = updatedGrade.course._id;
            }
        }));
    }));
}
function activateDeleteGradeBtn() {
    const deleteGradeBtns = root.querySelectorAll(".fa-square-minus");
    deleteGradeBtns.forEach((btn) => btn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const listEle = (_a = btn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        const gradeId = listEle.id;
        listEle.remove();
        const deletedGrade = yield fetch(`${gradesApi}/${gradeId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then(({ grade }) => grade)
            .catch((error) => console.error(error));
    })));
}
function activateAddGrade(courseId, studentId) {
    const addGradeBtn = root.querySelector("#addGradeBtn");
    const newGradeInput = root.querySelector("#newGradeInput");
    addGradeBtn.addEventListener("click", addGrade);
    newGradeInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter")
            addGrade();
    });
    function addGrade() {
        return __awaiter(this, void 0, void 0, function* () {
            const newGrade = yield fetch(`${gradesApi}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    score: parseInt(newGradeInput.value),
                    courseId,
                    studentId,
                }),
            })
                .then((res) => res.json())
                .then(({ grade }) => grade)
                .catch((error) => console.error(error));
            const gradeList = yield fetch(`${gradesApi}/${studentId}?courseId=${courseId}`)
                .then((res) => res.json())
                .then(({ grades }) => grades)
                .catch((error) => console.error(error));
            renderGradeList(gradeList);
            newGradeInput.value = "";
        });
    }
    newGradeInput.focus();
}
