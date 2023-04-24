async function renderGradeListXX(studentID: string) {
  const editWindow = document.querySelector(".editWindow") as HTMLDivElement;

  const student = new Student('Vladi', studentID)
  const deleteGradeBtns = editWindow.querySelectorAll(
    ".fa-square-minus"
  ) as NodeListOf<HTMLElement>;
  const deleteBtnsArr = Array.from(deleteGradeBtns);
  deleteGrade(deleteBtnsArr, student);
  const addGradeBtn = editWindow.querySelector(
    "#addGradeBtn"
  ) as HTMLInputElement;
  const newGradeInput = editWindow.querySelector(
    "#newGradeInput"
  ) as HTMLInputElement;
  newGradeInput.focus();
}

function deleteGrade(btnsArr: Element[], studentToUpdate: Student) {
  btnsArr.forEach((btn) =>
    btn.addEventListener("click", async () => {
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
    })
  );
}

