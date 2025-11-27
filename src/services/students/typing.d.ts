export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  classId: string;
  className?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImportStudentsDto {
  students: {
    studentId: string;
    name: string;
    email: string;
  }[];
}