async function createStudent(studentName: string, courseId: string) {
  const createdStudent: StudentTemplate = await fetch(`${studentApi}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: studentName, courseId }),
  })
    .then((res) => res.json())
    .then(({ student }) => student)
    .catch((error) => console.error(error));
  return createdStudent;
}

async function createGrade(score: number, courseId: string, studentId: string) {
  await fetch(`${gradesApi}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      score,
      courseId,
      studentId: studentId,
    }),
  }).catch((error) => console.error(error));
}
