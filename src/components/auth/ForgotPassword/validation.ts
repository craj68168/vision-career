import type { ForgotPasswordErrors } from "./types";

export const validateResetEmail = (
  email: string,
  lang: string,
): ForgotPasswordErrors => {
  const errors: ForgotPasswordErrors = {};

  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    errors.email =
      lang === "ja"
        ? "メールアドレスを入力してください"
        : "Email address is required";

    return errors;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    errors.email =
      lang === "ja"
        ? "有効なメールアドレスを入力してください"
        : "Please enter a valid email address";
  }

  return errors;
};

export const validateResetCode = (
  code: string,
  lang: string,
): ForgotPasswordErrors => {
  const errors: ForgotPasswordErrors = {};

  if (!code) {
    errors.code =
      lang === "ja"
        ? "確認コードを入力してください"
        : "Verification code is required";

    return errors;
  }

  if (!/^\d{6}$/.test(code)) {
    errors.code =
      lang === "ja"
        ? "6桁の確認コードを入力してください"
        : "Please enter the 6-digit verification code";
  }

  return errors;
};

export const validateNewPassword = (
  password: string,
  confirmPassword: string,
  lang: string,
): ForgotPasswordErrors => {
  const errors: ForgotPasswordErrors = {};

  if (!password) {
    errors.password =
      lang === "ja"
        ? "新しいパスワードを入力してください"
        : "New password is required";
  } else if (password.length < 8) {
    errors.password =
      lang === "ja"
        ? "パスワードは8文字以上で入力してください"
        : "Password must be at least 8 characters";
  }

  if (!confirmPassword) {
    errors.confirmPassword =
      lang === "ja"
        ? "確認用パスワードを入力してください"
        : "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword =
      lang === "ja" ? "パスワードが一致しません" : "Passwords do not match";
  }

  return errors;
};
