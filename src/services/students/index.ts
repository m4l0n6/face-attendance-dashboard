import apiClient from "../apiClient";
import type { Student, ImportStudentsDto } from "./typing";

interface Class {
  _id: string;
  name: string;
}

interface StudentResponse {
  _id?: string;
  id?: string;
  studentId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const studentService = {
  // Get all students from all classes
  getAll: async (): Promise<Student[]> => {
    try {
      const classesResponse = await apiClient.get("/classes");
      const classes = classesResponse.data || [];

      if (classes.length === 0) {
        return [];
      }

      const allStudents: Student[] = [];

      await Promise.all(
        classes.map(async (cls: Class) => {
          try {
            const studentsResponse = await apiClient.get(
              `/classes/${cls._id}/students`
            );
            const students = (studentsResponse.data || []).map((student: StudentResponse) => ({
              id: student._id || student.id,
              studentId: student.studentId,
              name: student.name,
              email: student.email,
              classId: cls._id,
              className: cls.name,
              createdAt: student.createdAt,
              updatedAt: student.updatedAt,
            }));
        allStudents.push(...students);
      } catch (error) {
        console.error(`Error fetching students for class ${cls._id}:`, error);
      }
    })
      );

      return allStudents;
    } catch (error) {
      console.error("Error fetching all students:", error);
      return [];
    }
  },

  // Get students by class ID
  getByClassId: async (classId: string): Promise<Student[]> => {
    const response = await apiClient.get(`/classes/${classId}/students`);
    return (response.data || []).map((student: StudentResponse) => ({
      id: student._id || student.id,
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      classId: classId,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));
  },

  // Import students to class via CSV
  importToClass: async (classId: string, data: ImportStudentsDto): Promise<void> => {
    await apiClient.post(`/classes/${classId}/students/import`, data);
  },
};
