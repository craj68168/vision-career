export type AdminRole = "admin";

export type AdminStatus = "active" | "inactive" | "suspended";

export type AdminLoginPayload = {
  username: string;

  password: string;
};

export type AdminUser = {
  adminId: string;

  username: string;

  role: AdminRole;

  status: AdminStatus;

  lastLoginAt?: string | null;

  createdAt?: string;

  updatedAt?: string;
};

export type AdminLoginResponse = {
  success: boolean;

  message: string;

  token: string;

  user: AdminUser;
};

export type AdminMeResponse = {
  success: boolean;

  user: AdminUser;

  message?: string;
};

export type AdminApiErrorResponse = {
  success?: boolean;

  message?: string;
};
