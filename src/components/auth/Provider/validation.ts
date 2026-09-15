import type {
  ProviderAuthErrors,
  ProviderLoginData,
  ProviderRegisterData,
} from "./types";

// ======================================================
// EMAIL REGEX
// ======================================================

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ======================================================
// REGISTER VALIDATION
// ======================================================

export const validateProviderRegister = (
  data: ProviderRegisterData,
  lang: string,
): ProviderAuthErrors => {
  const errors: ProviderAuthErrors = {};

  // --------------------------------------------------
  // Contact person name
  // --------------------------------------------------

  if (!data.name.trim()) {
    errors.name =
      lang === "ja"
        ? "担当者名を入力してください"
        : "Contact person name is required";
  } else if (data.name.trim().length < 2) {
    errors.name =
      lang === "ja"
        ? "担当者名は2文字以上で入力してください"
        : "Contact person name must be at least 2 characters";
  }

  // --------------------------------------------------
  // Company name
  // --------------------------------------------------

  if (!data.companyName.trim()) {
    errors.companyName =
      lang === "ja" ? "会社名を入力してください" : "Company name is required";
  } else if (data.companyName.trim().length < 2) {
    errors.companyName =
      lang === "ja"
        ? "会社名は2文字以上で入力してください"
        : "Company name must be at least 2 characters";
  }

  // --------------------------------------------------
  // Email
  // --------------------------------------------------

  const email = data.email.trim();

  if (!email) {
    errors.email =
      lang === "ja"
        ? "メールアドレスを入力してください"
        : "Email address is required";
  } else if (!emailRegex.test(email)) {
    errors.email =
      lang === "ja"
        ? "有効なメールアドレスを入力してください"
        : "Please enter a valid email address";
  }

  // --------------------------------------------------
  // Password
  // --------------------------------------------------

  if (!data.password) {
    errors.password =
      lang === "ja" ? "パスワードを入力してください" : "Password is required";
  } else if (data.password.length < 8) {
    errors.password =
      lang === "ja"
        ? "パスワードは8文字以上で入力してください"
        : "Password must be at least 8 characters";
  }

  return errors;
};

// ======================================================
// LOGIN VALIDATION
// ======================================================

export const validateProviderLogin = (
  data: ProviderLoginData,
  lang: string,
): ProviderAuthErrors => {
  const errors: ProviderAuthErrors = {};

  const email = data.email.trim();

  if (!email) {
    errors.email =
      lang === "ja"
        ? "メールアドレスを入力してください"
        : "Email address is required";
  } else if (!emailRegex.test(email)) {
    errors.email =
      lang === "ja"
        ? "有効なメールアドレスを入力してください"
        : "Please enter a valid email address";
  }

  if (!data.password) {
    errors.password =
      lang === "ja" ? "パスワードを入力してください" : "Password is required";
  }

  return errors;
};
