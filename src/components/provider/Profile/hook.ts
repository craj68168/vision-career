"use client";

import { useCallback, useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/context/LanguageContext";

import { getProviderProfile, updateProviderProfile } from "./api";

import {
  validateProviderProfile,
  validateProviderProfileField,
} from "./validation";

import type {
  ApiErrorResponse,
  ProviderProfile,
  ProviderProfileErrors,
  ProviderProfileFormData,
  ProviderProfileResponse,
} from "./types";

const initialFormData: ProviderProfileFormData = {
  companyName: "",
  phone: "",
  address: "",
  website: "",
  industry: "",

  contact_person: "",
  contact_person_phone: "",
  contact_person_email: "",

  hiring_needs: "",
  notes: "",
};

export const useProviderProfile = () => {
  const router = useRouter();

  const { lang } = useLanguage();

  const [profile, setProfile] = useState<ProviderProfile | null>(null);

  const [profileStatus, setProfileStatus] = useState({
    isComplete: false,

    completionPercentage: 0,

    missingFields: [] as Array<{
      field: string;
      label: string;
    }>,
  });

  const [formData, setFormData] =
    useState<ProviderProfileFormData>(initialFormData);

  const [errors, setErrors] = useState<ProviderProfileErrors>({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof ProviderProfileFormData, boolean>>
  >({});

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  // ======================================================
  // AUTH REDIRECT
  // ======================================================

  const redirectToLogin = useCallback(() => {
    localStorage.removeItem("access_token");

    localStorage.removeItem("user_role");

    router.replace(lang === "ja" ? "/auth" : "/en/auth");
  }, [lang, router]);

  // ======================================================
  // POPULATE
  // ======================================================

  const populateProfile = useCallback((data: ProviderProfileResponse) => {
    setProfile(data.profile);

    setProfileStatus({
      isComplete: data.is_complete,

      completionPercentage: data.completion_percentage,

      missingFields: data.missing_fields || [],
    });

    setFormData({
      companyName: data.profile.companyName || "",

      phone: data.profile.phone || "",

      address: data.profile.address || "",

      website: data.profile.website || "",

      industry: data.profile.industry || "",

      contact_person: data.profile.contact_person || "",

      contact_person_phone: data.profile.contact_person_phone || "",

      contact_person_email: data.profile.contact_person_email || "",

      hiring_needs: data.profile.hiring_needs || "",

      notes: data.profile.notes || "",
    });

    if (!data.is_complete) {
      setIsEditing(true);
    }
  }, []);

  // ======================================================
  // FETCH
  // ======================================================

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");

      const role = localStorage.getItem("user_role");

      if (!token || role !== "provider") {
        redirectToLogin();
        return;
      }

      setLoading(true);

      const data = await getProviderProfile();

      if (data.status !== "success") {
        throw new Error(data.message || "Failed to load profile");
      }

      populateProfile(data);
    } catch (error: unknown) {
      console.error("Provider profile error:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          redirectToLogin();
          return;
        }

        toast.error(error.response?.data?.message || "Failed to load profile");

        return;
      }

      toast.error(
        lang === "ja"
          ? "プロフィールの読み込みに失敗しました"
          : "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  }, [lang, populateProfile, redirectToLogin]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  // ======================================================
  // CHANGE
  // ======================================================

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = event.target;

      const field = name as keyof ProviderProfileFormData;

      setFormData((previous) => ({
        ...previous,

        [field]: value,
      }));

      if (errors[field]) {
        setErrors((previous) => ({
          ...previous,

          [field]: undefined,
        }));
      }
    },
    [errors],
  );

  // ======================================================
  // BLUR
  // ======================================================

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;

      const field = name as keyof ProviderProfileFormData;

      setTouched((previous) => ({
        ...previous,

        [field]: true,
      }));

      const error = validateProviderProfileField(field, value, lang);

      setErrors((previous) => ({
        ...previous,

        [field]: error,
      }));
    },
    [lang],
  );

  // ======================================================
  // SAVE
  // ======================================================

  const saveProfile = useCallback(async () => {
    const validation = validateProviderProfile(formData, lang);

    setErrors(validation.errors);

    if (!validation.isValid) {
      toast.error(
        lang === "ja"
          ? "入力内容を確認してください"
          : "Please check your input",
      );

      return;
    }

    try {
      setSaving(true);

      const data = await updateProviderProfile(formData);

      if (data.status !== "success") {
        throw new Error(data.message || "Failed to update profile");
      }

      populateProfile(data);

      setTouched({});

      setErrors({});

      setIsEditing(false);

      toast.success(
        lang === "ja"
          ? "会社情報を更新しました"
          : "Company profile updated successfully",
      );
    } catch (error: unknown) {
      console.error("Provider profile update:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update profile",
        );

        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  }, [formData, lang, populateProfile]);

  // ======================================================
  // CANCEL
  // ======================================================

  const cancelEdit = () => {
    setErrors({});
    setTouched({});
    setIsEditing(false);

    if (!profile) {
      return;
    }

    setFormData({
      companyName: profile.companyName || "",

      phone: profile.phone || "",

      address: profile.address || "",

      website: profile.website || "",

      industry: profile.industry || "",

      contact_person: profile.contact_person || "",

      contact_person_phone: profile.contact_person_phone || "",

      contact_person_email: profile.contact_person_email || "",

      hiring_needs: profile.hiring_needs || "",

      notes: profile.notes || "",
    });
  };

  const getFieldError = (field: keyof ProviderProfileFormData) => {
    if (touched[field] || isEditing) {
      return errors[field];
    }

    return undefined;
  };

  const isFieldMissing = (field: string) =>
    profileStatus.missingFields.some((item) => item.field === field);

  return {
    lang,

    profile,
    profileStatus,

    formData,

    loading,
    saving,

    isEditing,
    setIsEditing,

    handleInputChange,
    handleBlur,

    saveProfile,
    cancelEdit,

    getFieldError,
    isFieldMissing,

    refreshProfile: fetchProfile,
  };
};
