import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";

export async function getAdminOverview(
  token: string
) {
  return axios
    .get(`${APP_CONFIG_API_URL}/statistics/admin/overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}
