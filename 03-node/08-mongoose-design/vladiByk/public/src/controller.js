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
}
function renderCourses() {
    root.innerHTML = `
    <h1>Available courses</h1>
    <div id="coursesRoot">
      <a href="" class="course">Law</a>
      <a href="" class="course">English</a>
      <a href="" class="course">Gym</a>
      <a href="" class="course">Neurosciences</a>
      <a href="" class="course">Biochemistry</a>
      <a href="" class="course">Medicine</a>
    </div>
    <form action="" method="post">
      <label for="addCourseName">
        <input
          type="text"
          name="addCourseName"
          id="addCourseName"
          placeholder="Astrophysics..."
        />
      </label>
      <button type="submit">Add</button>
    </form>
    `;
}
const renderStudents = () => {
    //   const html = students
    //     .map(
    //       (student) =>
    //         `<div class="studentDiv" id="${student.id}">
    //             <b>${student.name}</b>
    //             <span>Average: ${student}</span>
    //             <div class="crudIcons">
    //               <i class="fa-regular fa-trash-can"></i>
    //               <i class="fa-regular fa-pen-to-square"></i>
    //              </div>
    //             </div>`
    //     )
    //     .join("");
    root.innerHTML = `
    <h1>Student list</h1>
    <div id="studentsRoot">
        <div class="studentDiv">
            <b>Vladislav Bykanov</b>
            <span>Average: 99</span>
            <div class="crudIcons">
              <i class="fa-regular fa-trash-can"></i>
              <i class="fa-regular fa-pen-to-square"></i>
            </div>
        </div>
    </div>
    <h4>Add student</h4>
    <form id="addStudentForm">
        <label for="name"
        >Full name:
        <input type="text" name="fullName" id="name" placeholder="John Doe"
        /></label>
        <label for="grade"
        >Grade: <input type="number" name="grade" id="grade" placeholder="88"
        /></label>
        <button type="submit">Add</button>
    </form>
    <div class="editWindow"></div>
  `;
    const deleteButtons = document.querySelectorAll(".fa-trash-can");
    deleteButtons.forEach((btn) => btn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const id = (_b = (_a = btn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.id;
        yield fetch(`${studentApi}/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).catch((error) => console.error(error));
        displayStudents();
    })));
};
// async function displayTeacherCourses(e: Event) {
//   e.preventDefault();
//   const teacherId = teacherIdInput.value;
//   const courseList = await fetch(`/api/v1/teachers/${teacherId}`, {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => data)
//     .catch((error) => console.error(error));
//   console.log(courseList);
//   teacherIdInput.value = "";
// }
const displayStudents = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentList = yield fetch(studentApi)
            .then((res) => res.json())
            .then(({ students }) => students.map((student) => new Student(student.name, student._id)));
        if (studentList)
            renderStudents();
    }
    catch (error) {
        console.error(error);
    }
});
// async function handleAddStudentForm(e: Event) {
//   e.preventDefault();
//   const newStudentName = addStudentForm.fullName.value;
//   const newStudentGrade = addStudentForm.grade.value;
//   const student = await fetch(`${studentApi}`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ name: newStudentName }),
//   })
//     .then((res) => res.json())
//     .then(({ student }) => new Student(student.name))
//     .catch((error) => console.error(error));
//   await fetch(`${gradesApi}`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ grade: newStudentGrade }),
//   }).catch((error) => console.error(error));
//   displayStudents();
// }
