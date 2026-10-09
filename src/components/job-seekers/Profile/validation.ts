import type {
  EducationRecord,
  EmploymentRecord,
  ProfileFormData,
  ProfileValidationErrors,
} from "./types";

const KANA_PATTERN = /^[\u3040-\u309f\u30a0-\u30ff\u3000\s・ー]+$/u;

export const validateProfileField = (
  field: keyof ProfileFormData,
  value: string,
  lang: string,
): string | undefined => {
  switch (field) {
    case "name_kana":
      if (value.trim() && !KANA_PATTERN.test(value.trim())) {
        return lang === "ja"
          ? "ふりがなはひらがなまたはカタカナで入力してください"
          : "Please enter the kana name using Hiragana or Katakana";
      }

      if (value.length > 150) {
        return lang === "ja"
          ? "ふりがなは150文字以内で入力してください"
          : "Name in Kana cannot exceed 150 characters";
      }
      break;

    case "phone":
      if (!value.trim()) {
        return lang === "ja"
          ? "電話番号を入力してください"
          : "Please enter your phone number";
      }

      if (!/^[0-9+\-()\s]{7,20}$/.test(value)) {
        return lang === "ja"
          ? "有効な電話番号を入力してください（7〜20文字）"
          : "Please enter a valid phone number (7-20 characters)";
      }
      break;

    case "address":
      if (!value.trim()) {
        return lang === "ja"
          ? "住所を入力してください"
          : "Please enter your address";
      }

      if (value.length < 5) {
        return lang === "ja"
          ? "住所は5文字以上で入力してください"
          : "Address must be at least 5 characters";
      }
      break;

    case "current_location":
      if (!value.trim()) {
        return lang === "ja"
          ? "現在地を入力してください"
          : "Please enter your current location";
      }

      if (value.trim().length < 2) {
        return lang === "ja"
          ? "現在地を正しく入力してください"
          : "Please enter a valid current location";
      }
      break;

    case "date_of_birth":
      if (value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return lang === "ja"
            ? "有効な生年月日を入力してください"
            : "Please enter a valid date of birth";
        }

        const birthDate = new Date(value);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        if (age < 15 || age > 100) {
          return lang === "ja"
            ? "年齢は15歳以上100歳以下である必要があります"
            : "Age must be between 15 and 100 years";
        }
      }
      break;

    case "visa_expiry_date":
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return lang === "ja"
          ? "有効な日付を入力してください"
          : "Please enter a valid date";
      }
      break;

    case "available_from":
      if (!value) {
        return lang === "ja"
          ? "就業可能日を入力してください"
          : "Please enter your available start date";
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return lang === "ja"
          ? "有効な日付を入力してください"
          : "Please enter a valid date";
      }
      break;

    case "nationality":
      if (!value) {
        return lang === "ja"
          ? "国籍を選択してください"
          : "Please select your nationality";
      }
      break;

    case "visa_type":
      if (!value) {
        return lang === "ja"
          ? "ビザ種類を選択してください"
          : "Please select your visa type";
      }
      break;

    case "japanese_level":
      if (!value) {
        return lang === "ja"
          ? "日本語レベルを選択してください"
          : "Please select your Japanese level";
      }
      break;

    case "desired_job":
      if (!value.trim()) {
        return lang === "ja"
          ? "希望職種を入力してください"
          : "Please enter your desired job";
      }
      break;

    case "desired_location":
      if (!value.trim()) {
        return lang === "ja"
          ? "希望勤務地を入力してください"
          : "Please enter your desired location";
      }
      break;
  }

  return undefined;
};

export const validateProfileForm = (
  formData: ProfileFormData,
  education: EducationRecord[],
  employmentHistory: EmploymentRecord[],
  lang: string,
) => {
  const errors: ProfileValidationErrors = {};

  Object.entries(formData).forEach(([key, value]) => {
    const field = key as keyof ProfileFormData;

    const error = validateProfileField(field, value, lang);

    if (error) {
      errors[field] = error;
    }
  });

  const invalidEducationIndex = education.findIndex(
    (record) => !record.school.trim(),
  );

  const invalidEmploymentIndex = employmentHistory.findIndex(
    (record) => !record.company_name.trim(),
  );

  return {
    errors,
    isValid:
      Object.keys(errors).length === 0 &&
      invalidEducationIndex === -1 &&
      invalidEmploymentIndex === -1,

    invalidEducationIndex,
    invalidEmploymentIndex,
  };
};
