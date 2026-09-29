import type {
  JobSeekerLoginData,
  JobSeekerRegisterData,
  ValidationErrors,
} from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthValidationMessages = {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
};

export const validateRegister = (
  data: JobSeekerRegisterData,
  messages: AuthValidationMessages,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.name.trim()) {
    errors.name = messages.nameRequired;
  }

  if (!data.email.trim()) {
    errors.email = messages.emailRequired;
  } else if (!emailRegex.test(data.email)) {
    errors.email = messages.emailInvalid;
  }

  if (!data.password) {
    errors.password = messages.passwordRequired;
  } else if (data.password.length < 8) {
    errors.password = messages.passwordMinLength;
  }

  return errors;
};

export const validateLogin = (
  data: JobSeekerLoginData,
  messages: AuthValidationMessages,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.email.trim()) {
    errors.email = messages.emailRequired;
  } else if (!emailRegex.test(data.email)) {
    errors.email = messages.emailInvalid;
  }

  if (!data.password) {
    errors.password = messages.passwordRequired;
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
