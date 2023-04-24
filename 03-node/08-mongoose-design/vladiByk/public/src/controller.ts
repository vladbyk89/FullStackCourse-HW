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

  const coursesBtn = root.querySelectorAll(
    ".course"
  ) as NodeListOf<HTMLButtonElement>;

  coursesBtn.forEach((btn) =>
    btn.addEventListener("click", () => {
      displayStudents(btn.id);
    })
  );
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

async function renderStudentsPage(studentsRootHtml: string, courseId: string) {
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

  const addStudentForm = root.querySelector(
    "#addStudentForm"
  ) as HTMLFormElement;

  addStudentForm.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    handleAddStudentForm(addStudentForm, courseId);
  });

  const deleteButtons = document.querySelectorAll(
    ".fa-trash-can"
  ) as NodeListOf<HTMLElement>;

  deleteButtons.forEach((btn) =>
    btn.addEventListener("click", async () => {
      const studentDiv = btn.parentElement?.parentElement as HTMLDivElement;

      const id = studentDiv.id;

      studentDiv.remove();

      await fetch(`${studentApi}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).catch((error) => console.error(error));
    })
  );
}

const displayStudents = async (courseId: string) => {
  try {
    let studentsRootHtml: string = " ";

    await fetch(`${studentApi}/${courseId}`)
      .then((res) => res.json())
      .then(({ students }) =>
        students.forEach(async (student: StudentTemplate) => {
          const newStudent = new Student(student.name, student._id, courseId);
          const studentAvgScore = await newStudent.getAverageInCourse(courseId);
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
        })
      )
      .catch((error) => console.log(error));
  } catch (error) {
    console.error(error);
  }
};

async function handleAddStudentForm(
  addStudentForm: HTMLFormElement,
  courseId: string
) {
  const newStudentName = addStudentForm.fullName.value;
  const newStudentGrade = addStudentForm.grade.value;
  console.log(typeof parseInt(newStudentGrade));

  const createdStudent: StudentTemplate = await fetch(`${studentApi}`, {
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

  const createdGrade = await fetch(`${gradesApi}`, {
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
}
