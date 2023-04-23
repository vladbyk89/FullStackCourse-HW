


const displayCourses = async () => {
  try {
    const coursesList = await fetch(courseApi)
      .then((res) => res.json())
      .then(({ courses }) =>
        courses.map(
          (course: CourseTemplate) =>
            new Course(course.name, course.teachers, course._id)
        )
      );
    // if (coursesList) renderCourses(coursesList);
  } catch (error) {
    console.error(error);
  }
};


async function deleteCourse(courseId: string) {
  await fetch(`${courseApi}/${courseId}`)
    .then((res) => res.json())
    .catch((error) => console.error(error));
}

displayCourses();
