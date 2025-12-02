import axios from "axios";
import { APP_CONFIG_API_URL } from "@/utils/constant";
import type {
  AllowedIP,
  CreateAllowedIPDto,
  UpdateAllowedIPDto,
  BulkCreateAllowedIPsDto,
  BulkCreateResponse,
  IPConfig,
  UpdateIPConfigDto,
  CurrentIPResponse,
  ApiResponse,
} from "./typing";

// ============ Public APIs ============

// Lấy IP hiện tại của client (không cần auth)
export async function getCurrentIP(): Promise<CurrentIPResponse> {
  const response = await axios.get<ApiResponse<CurrentIPResponse>>(
    `${APP_CONFIG_API_URL}/ip-config/current-ip`
  );
  return response.data.data;
}

// ============ Allowed IPs APIs ============

// Lấy tất cả IP được phép
export async function getAllAllowedIPs(token: string): Promise<AllowedIP[]> {
  const response = await axios.get<ApiResponse<AllowedIP[]>>(
    `${APP_CONFIG_API_URL}/ip-config/allowed-ips`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}

// Lấy các IP đang active
export async function getActiveAllowedIPs(token: string): Promise<AllowedIP[]> {
  const response = await axios.get<ApiResponse<AllowedIP[]>>(
    `${APP_CONFIG_API_URL}/ip-config/allowed-ips/active`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}

// Lấy IP theo ID
export async function getAllowedIPById(
  token: string,
  id: string
): Promise<AllowedIP> {
  const response = await axios.get<ApiResponse<AllowedIP>>(
    `${APP_CONFIG_API_URL}/ip-config/allowed-ips/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}

// Thêm IP mới
export async function createAllowedIP(
  token: string,
  data: CreateAllowedIPDto
): Promise<AllowedIP> {
  const response = await axios.post<ApiResponse<AllowedIP>>(
    `${APP_CONFIG_API_URL}/ip-config/allowed-ips`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}

// Thêm nhiều IP cùng lúc (Bulk)
export async function bulkCreateAllowedIPs(
  token: string,
  data: BulkCreateAllowedIPsDto
): Promise<BulkCreateResponse> {
  const response = await axios.post<ApiResponse<BulkCreateResponse>>(
    `${APP_CONFIG_API_URL}/ip-config/allowed-ips/bulk`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}

// Cập nhật IP
export async function updateAllowedIP(
  token: string,
  id: string,
  data: UpdateAllowedIPDto
): Promise<AllowedIP> {
  const response = await axios.put<ApiResponse<AllowedIP>>(
    `${APP_CONFIG_API_URL}/ip-config/allowed-ips/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}

// Toggle trạng thái IP (Bật/Tắt)
export async function toggleAllowedIP(
  token: string,
  id: string
): Promise<AllowedIP> {
  const response = await axios.patch<ApiResponse<AllowedIP>>(
    `${APP_CONFIG_API_URL}/ip-config/allowed-ips/${id}/toggle`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}

// Xóa IP
export async function deleteAllowedIP(token: string, id: string): Promise<void> {
  await axios.delete(`${APP_CONFIG_API_URL}/ip-config/allowed-ips/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ============ IP Config APIs ============

// Lấy cấu hình IP check
export async function getIPConfig(token: string): Promise<IPConfig> {
  const response = await axios.get<ApiResponse<IPConfig>>(
    `${APP_CONFIG_API_URL}/ip-config/config`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}

// Cập nhật cấu hình IP check
export async function updateIPConfig(
  token: string,
  data: UpdateIPConfigDto
): Promise<IPConfig> {
  const response = await axios.put<ApiResponse<IPConfig>>(
    `${APP_CONFIG_API_URL}/ip-config/config`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}

// Toggle kiểm tra IP (Bật/Tắt nhanh)
export async function toggleIPCheck(token: string): Promise<IPConfig> {
  const response = await axios.patch<ApiResponse<IPConfig>>(
    `${APP_CONFIG_API_URL}/ip-config/config/toggle`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
}
