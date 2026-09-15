export type ForgotPasswordAuthType = "seeker" | "provider";

export type ForgotPasswordStep = "email" | "code" | "reset" | "success";

export type ForgotPasswordResponse = {
  status: "success" | "error";
  message: string;
};

export type VerifyResetCodeResponse = {
  status: "success" | "error";
  message: string;
  reset_token: string;
};

export type ResetPasswordResponse = {
  status: "success" | "error";
  message: string;
};

export type ApiErrorResponse = {
  status?: string;
  message?: string;
};

export type ForgotPasswordErrors = {
  email?: string;
  code?: string;
  password?: string;
  confirmPassword?: string;
};
