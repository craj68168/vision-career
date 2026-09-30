import type {
  ProviderAuthErrors,
  ProviderLoginData,
  ProviderRegisterData,
} from "./types";

export type ProviderAuthValidationMessages = {
  contactPersonRequired: string;
  contactPersonMin: string;
  companyNameRequired: string;
  companyNameMin: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
};

// ======================================================
// EMAIL REGEX
// ======================================================

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ======================================================
// REGISTER VALIDATION
// ======================================================

export const validateProviderRegister = (
  data: ProviderRegisterData,
  messages: ProviderAuthValidationMessages,
): ProviderAuthErrors => {
  const errors: ProviderAuthErrors = {};

  // --------------------------------------------------
  // Contact person name
  // --------------------------------------------------

  if (!data.name.trim()) {
    errors.name = messages.contactPersonRequired;
  } else if (data.name.trim().length < 2) {
    errors.name = messages.contactPersonMin;
  }

  // --------------------------------------------------
  // Company name
  // --------------------------------------------------

  if (!data.companyName.trim()) {
    errors.companyName = messages.companyNameRequired;
  } else if (data.companyName.trim().length < 2) {
    errors.companyName = messages.companyNameMin;
  }

  // --------------------------------------------------
  // Email
  // --------------------------------------------------

  const email = data.email.trim();

  if (!email) {
    errors.email = messages.emailRequired;
  } else if (!emailRegex.test(email)) {
    errors.email = messages.emailInvalid;
  }

  // --------------------------------------------------
  // Password
  // --------------------------------------------------

  if (!data.password) {
    errors.password = messages.passwordRequired;
  } else if (data.password.length < 8) {
    errors.password = messages.passwordMin;
  }

  return errors;
};

// ======================================================
// LOGIN VALIDATION
// ======================================================

export const validateProviderLogin = (
  data: ProviderLoginData,
  messages: ProviderAuthValidationMessages,
): ProviderAuthErrors => {
  const errors: ProviderAuthErrors = {};

  const email = data.email.trim();

  if (!email) {
    errors.email = messages.emailRequired;
  } else if (!emailRegex.test(email)) {
    errors.email = messages.emailInvalid;
  }

  if (!data.password) {
    errors.password = messages.passwordRequired;
  }

  return errors;
};
