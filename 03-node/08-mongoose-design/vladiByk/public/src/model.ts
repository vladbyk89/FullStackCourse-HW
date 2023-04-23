class Teacher {
  constructor(public name: string) {}
}

interface TeacherTemplate {
  name: string;
  _id: string;
}

class Student {
  constructor(public name: string, public id: string = "") {}
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
