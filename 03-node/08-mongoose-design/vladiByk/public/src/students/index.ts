async function renderGradeListXX(studentID: string) {
  const editWindow = document.querySelector(".editWindow") as HTMLDivElement;

  const student = new Student('Vladi', studentID)
  const addGradeBtn = editWindow.querySelector(
    "#addGradeBtn"
  ) as HTMLInputElement;
  const newGradeInput = editWindow.querySelector(
    "#newGradeInput"
  ) as HTMLInputElement;
  newGradeInput.focus();
}


