import type { ProviderProfileErrors, ProviderProfileFormData } from "./types";

export const validateProviderProfileField = (
  field: keyof ProviderProfileFormData,
  value: string,
  lang: string,
): string | undefined => {
  switch (field) {
    case "companyName":
      if (!value.trim()) {
        return lang === "ja" ? "会社名は必須です" : "Company name is required";
      }

      if (value.trim().length < 2) {
        return lang === "ja"
          ? "会社名は2文字以上で入力してください"
          : "Company name must be at least 2 characters";
      }

      break;

    case "phone":
      if (!value.trim()) {
        return lang === "ja"
          ? "電話番号は必須です"
          : "Phone number is required";
      }

      if (!/^[\d\s\-+()]+$/.test(value)) {
        return lang === "ja"
          ? "有効な電話番号を入力してください"
          : "Please enter a valid phone number";
      }

      break;

    case "address":
      if (!value.trim()) {
        return lang === "ja" ? "住所は必須です" : "Address is required";
      }

      if (value.trim().length < 5) {
        return lang === "ja"
          ? "住所は5文字以上で入力してください"
          : "Address must be at least 5 characters";
      }

      break;

    case "industry":
      if (!value) {
        return lang === "ja"
          ? "業種を選択してください"
          : "Please select an industry";
      }

      break;

    case "contact_person":
      if (!value.trim()) {
        return lang === "ja"
          ? "担当者名は必須です"
          : "Contact person is required";
      }

      break;

    case "contact_person_phone":
      if (!value.trim()) {
        return lang === "ja"
          ? "担当者電話番号は必須です"
          : "Contact person phone is required";
      }

      if (!/^[\d\s\-+()]+$/.test(value)) {
        return lang === "ja"
          ? "有効な電話番号を入力してください"
          : "Please enter a valid phone number";
      }

      break;

    case "contact_person_email":
      if (!value.trim()) {
        return lang === "ja"
          ? "担当者メールアドレスは必須です"
          : "Contact person email is required";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return lang === "ja"
          ? "有効なメールアドレスを入力してください"
          : "Please enter a valid email address";
      }

      break;

    case "website":
      if (value && !/^https?:\/\/.+/i.test(value)) {
        return lang === "ja"
          ? "https:// を含むURLを入力してください"
          : "Website must include http:// or https://";
      }

      break;
  }

  return undefined;
};

export const validateProviderProfile = (
  data: ProviderProfileFormData,
  lang: string,
) => {
  const errors: ProviderProfileErrors = {};

  (Object.keys(data) as Array<keyof ProviderProfileFormData>).forEach(
    (field) => {
      const error = validateProviderProfileField(field, data[field], lang);

      if (error) {
        errors[field] = error;
      }
    },
  );

  return {
    errors,

    isValid: Object.keys(errors).length === 0,
  };
};
