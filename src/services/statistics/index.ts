import apiClient from "../apiClient";
import type { AdminOverviewResponse } from "./typing";

export async function getAdminOverview(token: string): Promise<AdminOverviewResponse> {
  const response = await apiClient.get("/statistics/admin/overview", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
