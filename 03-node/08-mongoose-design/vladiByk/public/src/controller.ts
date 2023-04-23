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

  const teacherLoginForm = document.querySelector(
    "#teacherLoginForm"
  ) as HTMLFormElement;

  const teacherIdInput = document.querySelector(
    "#teacherId"
  ) as HTMLInputElement;

  teacherLoginForm.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    checkTeacherId(teacherIdInput.value);
    teacherIdInput.value = "";
  });
}

async function checkTeacherId(teacherId: string) {
  try {
    const teacher: TeacherTemplate = await fetch(`${teacherApi}/${teacherId}`)
      .then((res) => res.json())
      .then(({ teacher }) => teacher)
      .catch((error) => console.error(error));
    if (!teacher) throw new Error("Teacher not found!");
    console.log(teacher);
    renderCoursePage(teacher._id);
  } catch (error) {
    console.error(error);
  }
}

async function renderCoursePage(teacherId: string) {
  const courses: CourseTemplate[] = await fetch(`${courseApi}/${teacherId}`)
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

  const addCourseForm = root.querySelector("#addCourseForm") as HTMLFormElement;

  addCourseForm.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    const courseName = addCourseForm.courseName.value;
    console.log(courseName);
    addCourse(courseName, teacherId);
  });
}

async function addCourse(courseName: string, teacherId: string) {
  await fetch(`${courseApi}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseName, teacherId }),
  }).catch((error) => console.error(error));
  renderCoursePage(teacherId);
}

function renderCoursesRoot(coursesList: CourseTemplate[]) {
  const coursesRoot = document.querySelector("#coursesRoot") as HTMLDivElement;
  coursesRoot.innerHTML = coursesList
    .map(
      (course) =>
        `<button class="course" id="${course._id}">${course.name}</button>`
    )
    .join("");
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

  const deleteButtons = document.querySelectorAll(
    ".fa-trash-can"
  ) as NodeListOf<HTMLElement>;
  deleteButtons.forEach((btn) =>
    btn.addEventListener("click", async () => {
      const id = btn.parentElement?.parentElement?.id;
      await fetch(`${studentApi}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).catch((error) => console.error(error));
      displayStudents();
    })
  );
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

const displayStudents = async () => {
  try {
    const studentList = await fetch(studentApi)
      .then((res) => res.json())
      .then(({ students }) =>
        students.map(
          (student: StudentTemplate) => new Student(student.name, student._id)
        )
      );
    if (studentList) renderStudents();
  } catch (error) {
    console.error(error);
  }
};

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
