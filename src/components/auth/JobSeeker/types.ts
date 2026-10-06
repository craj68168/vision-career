export type AuthMode = "login" | "register";

export type JobSeekerRegisterData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type JobSeekerLoginData = {
  email: string;
  password: string;
};

export type JobSeekerUser = {
  id?: string;
  seeker_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: "seeker";
  approval_status?: "pending" | "approved" | "rejected";
  account_status?: "active" | "inactive" | "suspended";
  account_source?: "self_registration" | "admin";
  password_setup_required?: boolean;
};

export type JobSeekerAuthResponse = {
  success?: boolean;
  status?: string;
  message: string;
  token?: string;
  user?: JobSeekerUser;
};

export type ValidationErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
};
