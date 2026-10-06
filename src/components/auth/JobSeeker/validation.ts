import type {
  JobSeekerLoginData,
  JobSeekerRegisterData,
  ValidationErrors,
} from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneCharactersRegex = /^[+\d\s()-]+$/;

export type AuthValidationMessages = {
  nameRequired: string;

  emailRequired: string;
  emailInvalid: string;

  phoneRequired: string;
  phoneInvalid: string;

  passwordRequired: string;
  passwordMinLength: string;
};

// ======================================================
// PHONE VALIDATION
// ======================================================

const isValidPhone = (phone: string): boolean => {
  const normalizedPhone = phone.trim();

  if (!normalizedPhone) {
    return false;
  }

  if (!phoneCharactersRegex.test(normalizedPhone)) {
    return false;
  }

  const digits = normalizedPhone.replace(/\D/g, "");

  return digits.length >= 7 && digits.length <= 15;
};

// ======================================================
// REGISTER VALIDATION
// ======================================================

export const validateRegister = (
  data: JobSeekerRegisterData,
  messages: AuthValidationMessages,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // ====================================================
  // NAME
  // ====================================================

  if (!data.name.trim()) {
    errors.name = messages.nameRequired;
  }

  // ====================================================
  // EMAIL
  // ====================================================

  if (!data.email.trim()) {
    errors.email = messages.emailRequired;
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = messages.emailInvalid;
  }

  // ====================================================
  // PHONE
  // ====================================================

  if (!data.phone.trim()) {
    errors.phone = messages.phoneRequired;
  } else if (!isValidPhone(data.phone)) {
    errors.phone = messages.phoneInvalid;
  }

  // ====================================================
  // PASSWORD
  // ====================================================

  if (!data.password) {
    errors.password = messages.passwordRequired;
  } else if (data.password.length < 8) {
    errors.password = messages.passwordMinLength;
  }

  return errors;
};

// ======================================================
// LOGIN VALIDATION
// ======================================================

export const validateLogin = (
  data: JobSeekerLoginData,
  messages: AuthValidationMessages,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.email.trim()) {
    errors.email = messages.emailRequired;
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = messages.emailInvalid;
  }

  if (!data.password) {
    errors.password = messages.passwordRequired;
  }

  return errors;
};

// ======================================================
// HAS VALIDATION ERRORS
// ======================================================

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
