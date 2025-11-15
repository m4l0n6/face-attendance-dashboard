export interface Classes {
  id: string
  name: string
  code: string
  description: string
  lecturerId: string
  _count: ClassesCount
  createdAt: string
}

type ClassesCount = {
    students: number;
    sessions: number;
}