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
