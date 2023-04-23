class Teacher {
  constructor(public name: string) {}
}

interface TeacherTemplate {
  name: string;
  _id: string;
}

class Student {
  public studentAverage: number = 0;
  constructor(
    public name: string,
    public id: string,
    private courseId: string = ""
  ) {}

  async getAverageInCourse(courseId: string) {
    const grades: number[] = await fetch(
      `${gradesApi}/${this.id}?courseId=${courseId}`
    )
      .then((res) => res.json())
      .then(({ grades }) => grades.map((grade: GradeTemplate) => grade.score))
      .catch((error) => console.error(error));

    console.log(grades);

    const gradesAverage: number =
      grades.reduce((a, b) => a + b, 0) / grades.length;

    console.log(gradesAverage);

    this.studentAverage = gradesAverage;
  }
}

interface StudentTemplate {
  name: string;
  _id: string;
}

class Course {
  constructor(
    public name: string,
    public teachers: string[] = [],
    public id: string
  ) {}
  async getStudents() {
    const students = await fetch("/api/v1/students").then;
    return "student list";
  }
}

interface CourseTemplate {
  name: string;
  teachers: [string];
  _id: string;
}

class Grade {
  constructor(
    public score: number,
    public course: string,
    public student: string
  ) {}
}

interface GradeTemplate {
  score: number;
  course: string;
  student: string;
  _id: string;
}
