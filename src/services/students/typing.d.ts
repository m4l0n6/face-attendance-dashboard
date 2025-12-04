import { PostFaceImages } from './typing.d';
export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  classId: string;
  class: Class;
  faceImage?: FaceImage | null;
  faceDescriptorsCount?: number;
  hasFaceDescriptor?: boolean;
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

export interface GetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetStudentsResponse {
  data: Student[];
  pagination: PaginationMeta;
}

export interface Class{
  id: string;
  name: string;
  code: string;
  description: string;
  lecturer?: {
    uid: string;
    displayName: string;
    email: string;
  };
}

export interface FaceImage {
  id: string;
  imageUrl: string;
  publicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostFaceImages{
  studentId: string;
  image: File;
}

export interface PutFaceImages{
  image: File;
}

export interface PostFaceImagesResponse {
  data: {
    id: string;
    studentId: string;
    imageUrl: string; 
    publicId: string;
    createdAt: string;
    updatedAt: string;
    student: Student;
  }
}