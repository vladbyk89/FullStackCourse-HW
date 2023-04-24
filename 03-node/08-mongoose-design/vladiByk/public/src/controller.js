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
        >Grade: <input type="number" name="grade" id="grade" placeholder="88" required
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
    });
}
const displayStudents = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let studentsRootHtml = " ";
        yield fetch(`${studentApi}/${courseId}`)
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
        console.log(typeof parseInt(newStudentGrade));
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
        console.log(createdStudent);
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
        console.log(createdGrade);
        displayStudents(courseId);
    });
}
