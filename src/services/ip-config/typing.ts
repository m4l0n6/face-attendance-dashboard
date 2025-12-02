// AllowedIP Types
export interface AllowedIP {
  id: string;
  ipAddress: string;
  type: "SINGLE" | "RANGE";
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAllowedIPDto {
  ipAddress: string;
  type?: "SINGLE" | "RANGE";
  description?: string;
  isActive?: boolean;
}

export interface UpdateAllowedIPDto {
  ipAddress?: string;
  type?: "SINGLE" | "RANGE";
  description?: string;
  isActive?: boolean;
}

export interface BulkCreateAllowedIPsDto {
  ips: CreateAllowedIPDto[];
}

export interface BulkCreateResponse {
  created: AllowedIP[];
  skipped: { ipAddress: string; reason: string }[];
  errors: string[];
}

// IPConfig Types
export interface IPConfig {
  id: string;
  enabled: boolean;
  errorMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateIPConfigDto {
  enabled?: boolean;
  errorMessage?: string;
}

// Current IP Response
export interface CurrentIPResponse {
  rawIp: string;
  cleanIp: string;
  isAllowed: boolean;
  headers: {
    "x-forwarded-for": string | null;
    "x-real-ip": string | null;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
