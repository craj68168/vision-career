import type {
  ProviderProfileErrors,
  ProviderProfileFormData,
} from "./types";

type ProviderProfileValidationKey =
  | "validation.companyNameRequired"
  | "validation.companyNameMinLength"
  | "validation.phoneRequired"
  | "validation.phoneInvalid"
  | "validation.addressRequired"
  | "validation.addressMinLength"
  | "validation.industryRequired"
  | "validation.contactPersonRequired"
  | "validation.contactPhoneRequired"
  | "validation.contactEmailRequired"
  | "validation.contactEmailInvalid"
  | "validation.websiteInvalid";

type ProviderProfileTranslator = (
  key: ProviderProfileValidationKey,
) => string;

export const validateProviderProfileField = (
  field: keyof ProviderProfileFormData,
  value: string,
  t: ProviderProfileTranslator,
): string | undefined => {
  switch (field) {
    case "companyName":
      if (!value.trim()) {
        return t("validation.companyNameRequired");
      }

      if (value.trim().length < 2) {
        return t("validation.companyNameMinLength");
      }

      break;

    case "phone":
      if (!value.trim()) {
        return t("validation.phoneRequired");
      }

      if (!/^[\d\s\-+()]+$/.test(value)) {
        return t("validation.phoneInvalid");
      }

      break;

    case "address":
      if (!value.trim()) {
        return t("validation.addressRequired");
      }

      if (value.trim().length < 5) {
        return t("validation.addressMinLength");
      }

      break;

    case "industry":
      if (!value) {
        return t("validation.industryRequired");
      }

      break;

    case "contact_person":
      if (!value.trim()) {
        return t("validation.contactPersonRequired");
      }

      break;

    case "contact_person_phone":
      if (!value.trim()) {
        return t("validation.contactPhoneRequired");
      }

      if (!/^[\d\s\-+()]+$/.test(value)) {
        return t("validation.phoneInvalid");
      }

      break;

    case "contact_person_email":
      if (!value.trim()) {
        return t("validation.contactEmailRequired");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return t("validation.contactEmailInvalid");
      }

      break;

    case "website":
      if (value && !/^https?:\/\/.+/i.test(value)) {
        return t("validation.websiteInvalid");
      }

      break;
  }

  return undefined;
};

export const validateProviderProfile = (
  data: ProviderProfileFormData,
  t: ProviderProfileTranslator,
) => {
  const errors: ProviderProfileErrors = {};

  (
    Object.keys(data) as Array<keyof ProviderProfileFormData>
  ).forEach((field) => {
    const error = validateProviderProfileField(
      field,
      data[field],
      t,
    );

    if (error) {
      errors[field] = error;
    }
  });

  return {
    errors,

    isValid: Object.keys(errors).length === 0,
  };
};