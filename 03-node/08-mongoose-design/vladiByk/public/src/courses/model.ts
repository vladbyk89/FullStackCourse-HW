interface TeacherTemplate {
  name: string;
  _id: string;
}


interface StudentTemplate {
  name: string;
  course: CourseTemplate;
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
  teachers: [TeacherTemplate];
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
  course: CourseTemplate;
  student: StudentTemplate;
  _id: string;
}
