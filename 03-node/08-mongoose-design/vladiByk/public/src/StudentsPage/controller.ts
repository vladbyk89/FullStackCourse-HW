async function renderStudentsPage(studentsRootHtml: string, courseId: string) {
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
        <button id="backToCoursesPageBtn">return</button>
        <button id="deleteCourseBtn">delete course</button>
        <div class="editWindow"></div>
      `;

    const addStudentForm = root.querySelector(
      "#addStudentForm"
    ) as HTMLFormElement;

    addStudentForm.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      handleAddStudentForm(addStudentForm, courseId);
    });

    const backToCoursesPageBtn = root.querySelector(
      "#backToCoursesPageBtn"
    ) as HTMLButtonElement;

    backToCoursesPageBtn.addEventListener("click", () => {
      location.href = "/teacher";
    });

    const deleteCourseBtn = root.querySelector(
      "#deleteCourseBtn"
    ) as HTMLButtonElement;

    deleteCourseBtn.addEventListener("click", async () => {
      const courseId = sessionStorage.getItem("courseId");
      await fetch(`${courseApi}/${courseId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      location.href = "/teacher";
    });

    activateDeleteButtons();
    activateEditButtons(courseId);
  } catch (error) {
    console.log(error);
  }
}

const displayStudents = async (courseId: string) => {
  try {
    let studentsRootHtml: string = " ";

    const studentsInCourse = await fetch(`${studentApi}/inCourse/${courseId}`)
      .then((res) => res.json())
      .then(({ students }) =>
        students.forEach(async (student: StudentTemplate) => {
          const newStudent = new Student(student.name, student._id, courseId);
          const studentAvgScore = await newStudent.getAverageInCourse(courseId);
          if (!studentAvgScore) return;
          studentsRootHtml += `
            <div class="studentDiv" id="${student._id}">
                <b>${student.name}</b>
                <span>${studentAvgScore.toFixed(2)}</span>
                <div class="crudIcons">
                  <i class="fa-regular fa-trash-can"></i>
                  <i class="fa-regular fa-pen-to-square"></i>
                </div>
            </div>`;
          renderStudentsPage(studentsRootHtml, courseId);
        })
      )
      .catch((error) => console.log(error));

    if (!studentsInCourse) renderStudentsPage(studentsRootHtml, courseId);
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

  const createdStudent: StudentTemplate = await createStudent(
    newStudentName,
    courseId
  );

  await createGrade(parseInt(newStudentGrade), courseId, createdStudent._id);

  displayStudents(courseId);
}

function activateDeleteButtons() {
  try {
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
  } catch (error) {
    console.log(error);
  }
}

async function activateEditButtons(courseId: string) {
  const editButtons = root.querySelectorAll(
    ".fa-pen-to-square"
  ) as NodeListOf<HTMLElement>;

  editButtons.forEach((btn) =>
    btn.addEventListener("click", async () => {
      const studentId = btn.parentElement?.parentElement?.id;

      const grades: GradeTemplate[] = await fetch(
        `${gradesApi}/${studentId}?courseId=${courseId}`
      )
        .then((res) => res.json())
        .then(({ grades }) => grades)
        .catch((error) => console.error(error));

      renderGradeList(grades);
    })
  );
}

function renderGradeList(gradeList: GradeTemplate[]) {
  const studentName = gradeList[0].student.name;
  const studentId = gradeList[0].student._id;
  const courseId = gradeList[0].course._id;

  const editWindow = document.querySelector(".editWindow") as HTMLDivElement;

  const listItemsHtml = gradeList
    .map(
      (grade) =>
        `<li id="${grade._id}">
      <span>${grade.score.toFixed(2)}</span>
      <div class="listIcons">
        <i class="fa-regular fa-square-minus"></i>
        <i class="fa-solid fa-pen"></i>
      </div>
    </li>`
    )
    .join("");

  editWindow.innerHTML = `
        <div class="editWindowHead">
          <h2>${studentName}</h2>
          <i class="fa-solid fa-user-pen"></i>
        </div>
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

  const closeEditWindowBtn = root.querySelector(
    "#closeEditWindow"
  ) as HTMLButtonElement;

  closeEditWindowBtn.addEventListener("click", () => {
    displayStudents(courseId);
    editWindow.style.display = "none";
  });
  activateEditUserName(studentId);
  activateEditGradeButtons();
  activateDeleteGradeBtn();
  activateAddGrade(courseId, studentId);
}

function activateEditUserName(studentId: string) {
  const editBtn = root.querySelector(".fa-user-pen") as HTMLElement;
  const editWindowHead = root.querySelector(
    ".editWindowHead"
  ) as HTMLDivElement;
  const headerEle = editWindowHead.firstElementChild as HTMLHeadElement;

  const nameInputEle = document.createElement("input") as HTMLInputElement;

  nameInputEle.setAttribute("type", "text");
  nameInputEle.value = headerEle.innerHTML;

  editBtn.addEventListener("click", () => {
    editWindowHead.replaceChild(nameInputEle, headerEle);
    nameInputEle.focus();
  });

  nameInputEle.addEventListener("keyup", async (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      headerEle.innerHTML = nameInputEle.value;
      editWindowHead.replaceChild(headerEle, nameInputEle);
      await fetch(`${studentApi}/${studentId}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName: nameInputEle.value }),
      });
    }
  });
}

function activateEditGradeButtons() {
  const editGradeBtns = root.querySelectorAll(
    ".fa-pen"
  ) as NodeListOf<HTMLIFrameElement>;

  editGradeBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const listEle = btn.parentElement?.parentElement as HTMLDataListElement;

      const gradeId = listEle.id;

      const iconDiv = listEle.querySelector(".listIcons") as HTMLDivElement;

      const spanEle = listEle.firstElementChild as HTMLSpanElement;

      const gradeInputEle = document.createElement("input") as HTMLInputElement;

      gradeInputEle.setAttribute("type", "number");
      gradeInputEle.value = spanEle.innerHTML;

      listEle.replaceChild(gradeInputEle, spanEle);

      gradeInputEle.focus();

      iconDiv.style.display = "none";

      gradeInputEle.addEventListener("keyup", async (e) => {
        if (e.key === "Enter") {
          if (
            Number(gradeInputEle.value) > 100 ||
            Number(gradeInputEle.value) < 0 ||
            !Number(gradeInputEle.value)
          )
            return alert("Check grade input");

          spanEle.textContent = gradeInputEle.value;
          listEle.replaceChild(spanEle, gradeInputEle);
          iconDiv.style.display = "flex";

          const updatedGrade: GradeTemplate = await fetch(
            `${gradesApi}/${gradeId}`,
            {
              method: "PATCH",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                newScore: parseInt(gradeInputEle.value),
              }),
            }
          )
            .then((res) => res.json())
            .then(({ grade }) => grade)
            .catch((error) => console.error(error));

          const courseId = updatedGrade.course._id;
        }
      });
    })
  );
}

function activateDeleteGradeBtn() {
  const deleteGradeBtns = root.querySelectorAll(
    ".fa-square-minus"
  ) as NodeListOf<HTMLIFrameElement>;

  deleteGradeBtns.forEach((btn) =>
    btn.addEventListener("click", async () => {
      const listEle = btn.parentElement?.parentElement as HTMLDataListElement;

      const gradeId = listEle.id;

      listEle.remove();

      const deletedGrade: GradeTemplate = await fetch(
        `${gradesApi}/${gradeId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then(({ grade }) => grade)
        .catch((error) => console.error(error));
    })
  );
}

function activateAddGrade(courseId: string, studentId: string) {
  const addGradeBtn = root.querySelector("#addGradeBtn") as HTMLInputElement;

  const newGradeInput = root.querySelector(
    "#newGradeInput"
  ) as HTMLInputElement;

  addGradeBtn.addEventListener("click", addGrade);

  newGradeInput.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Enter") addGrade();
  });

  async function addGrade() {
    const newGrade = await fetch(`${gradesApi}`, {
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

    const gradeList = await fetch(
      `${gradesApi}/${studentId}?courseId=${courseId}`
    )
      .then((res) => res.json())
      .then(({ grades }) => grades)
      .catch((error) => console.error(error));

    renderGradeList(gradeList);

    newGradeInput.value = "";
  }

  newGradeInput.focus();
}