import { apiClient } from "@/utils/apiClient";
import type { Classes, CreateClassDto, UpdateClassDto } from "./typing";

interface ApiClassResponse {
  _id: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const classService = {
  getAll: async (): Promise<Classes[]> => {
    const response = await apiClient.get("/classes");
    return response.data.map((cls: ApiClassResponse) => ({
      id: cls._id,
      name: cls.name,
      code: cls.code,
      description: cls.description,
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
    }));
  },

  getById: async (id: string): Promise<Classes> => {
    const response = await apiClient.get(`/classes/${id}`);
    const cls = response.data;
    return {
      id: cls._id,
      name: cls.name,
      code: cls.code,
      description: cls.description,
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
    };
  },

  create: async (data: CreateClassDto): Promise<Classes> => {
    const response = await apiClient.post("/classes", data);
    const cls = response.data;
    return {
      id: cls._id,
      name: cls.name,
      code: cls.code,
      description: cls.description,
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
    };
  },

  update: async (id: string, data: UpdateClassDto): Promise<Classes> => {
    const response = await apiClient.put(`/classes/${id}`, data);
    const cls = response.data;
    return {
      id: cls._id,
      name: cls.name,
      code: cls.code,
      description: cls.description,
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
    };
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/classes/${id}`);
  },
};