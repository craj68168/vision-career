"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
import { useLanguage } from "@/context/LanguageContext";

import {
  getJobSeekerProfile,
  updateJobSeekerProfile,
  uploadJobSeekerResume,
} from "./api";

import { validateProfileField, validateProfileForm } from "./validation";

import type {
  ApiErrorResponse,
  EducationRecord,
  EmploymentRecord,
  JobSeekerProfile,
  MissingField,
  ProfileFormData,
  ProfileValidationErrors,
} from "./types";
import { formatDateForInput } from "@/lib/helpers";

const initialFormData: ProfileFormData = {
  phone: "",
  address: "",
  date_of_birth: "",
  gender: "",
  nationality: "",
  visa_type: "",
  visa_expiry_date: "",
  japanese_level: "",
  desired_job: "",
  desired_location: "",
  available_from: "",
  notes: "",
};

export const useJobSeekerProfile = () => {
  const { lang } = useLanguage();
  const router = useRouter();

  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);

  const [education, setEducation] = useState<EducationRecord[]>([]);

  const [employmentHistory, setEmploymentHistory] = useState<
    EmploymentRecord[]
  >([]);

  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

  const [profileStatus, setProfileStatus] = useState({
    isComplete: false,
    completionPercentage: 0,
    missingFields: [] as MissingField[],
  });

  const [errors, setErrors] = useState<ProfileValidationErrors>({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof ProfileFormData, boolean>>
  >({});

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploadingResume, setUploadingResume] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const populateProfile = useCallback(
    (data: Awaited<ReturnType<typeof getJobSeekerProfile>>) => {
      setProfile(data.profile);

      setProfileStatus({
        isComplete: data.is_complete,
        completionPercentage: data.completion_percentage,
        missingFields: data.missing_fields || [],
      });

      setEducation(
        (data.education || []).map((record) => ({
          ...record,

          enrollment_date: formatDateForInput(record.enrollment_date),

          graduation_date: formatDateForInput(record.graduation_date),
        })),
      );

      setEmploymentHistory(
        (data.employment_history || []).map((record) => ({
          ...record,

          start_date: formatDateForInput(record.start_date),

          end_date: formatDateForInput(record.end_date),
        })),
      );

      setFormData({
        phone: data.profile.phone || "",
        address: data.profile.address || "",

        date_of_birth: formatDateForInput(data.profile.date_of_birth),

        gender: data.profile.gender || "",

        nationality: data.profile.nationality || "",

        visa_type: data.profile.visa_type || "",

        visa_expiry_date: formatDateForInput(data.profile.visa_expiry_date),

        japanese_level: data.profile.japanese_level || "",

        desired_job: data.profile.desired_job || "",

        desired_location: data.profile.desired_location || "",

        available_from: formatDateForInput(data.profile.available_from),

        notes: data.profile.notes || "",
      });

      if (!data.is_complete) {
        setIsEditing(true);
      }
    },
    [],
  );

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");

      const role = localStorage.getItem("user_role");

      if (!token || role !== "seeker") {
        router.replace(
          lang === "ja" ? "/job-seekers-auth" : "/en/job-seekers-auth",
        );

        return;
      }

      const data = await getJobSeekerProfile();

      if (data.status !== "success") {
        throw new Error(data.message || "Failed to load profile");
      }

      populateProfile(data);
    } catch (error: unknown) {
      console.error("Error fetching profile:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("access_token");

          localStorage.removeItem("user_role");

          router.replace(
            lang === "ja" ? "/job-seekers-auth" : "/en/job-seekers-auth",
          );

          return;
        }

        toast.error(
          error.response?.data?.message ||
            (lang === "ja"
              ? "プロフィールの読み込みに失敗しました"
              : "Failed to load profile"),
        );

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
  }, [lang, populateProfile, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = event.target;

      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }));

      setErrors((previous) => ({
        ...previous,
        [name]: undefined,
      }));
    },
    [],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;

      const field = name as keyof ProfileFormData;

      setTouched((previous) => ({
        ...previous,
        [field]: true,
      }));

      const error = validateProfileField(field, value, lang);

      setErrors((previous) => ({
        ...previous,
        [field]: error,
      }));
    },
    [lang],
  );

  const addEducationRecord = () => {
    setEducation((previous) => [
      ...previous,
      {
        enrollment_date: null,
        graduation_date: null,
        school_type: null,
        school: "",
        major: null,
      },
    ]);
  };

  const removeEducationRecord = (index: number) => {
    setEducation((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updateEducationRecord = (
    index: number,
    field: keyof EducationRecord,
    value: string,
  ) => {
    setEducation((previous) =>
      previous.map((record, itemIndex) =>
        itemIndex === index
          ? {
              ...record,
              [field]: value,
            }
          : record,
      ),
    );
  };

  const addEmploymentRecord = () => {
    setEmploymentHistory((previous) => [
      ...previous,
      {
        start_date: null,
        end_date: null,
        employment_type: null,
        company_name: "",
      },
    ]);
  };

  const removeEmploymentRecord = (index: number) => {
    setEmploymentHistory((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updateEmploymentRecord = (
    index: number,
    field: keyof EmploymentRecord,
    value: string,
  ) => {
    setEmploymentHistory((previous) =>
      previous.map((record, itemIndex) =>
        itemIndex === index
          ? {
              ...record,
              [field]: value,
            }
          : record,
      ),
    );
  };

  const saveProfile = async () => {
    const validation = validateProfileForm(
      formData,
      education,
      employmentHistory,
      lang,
    );

    setErrors(validation.errors);

    const allTouched = Object.keys(formData).reduce(
      (result, key) => {
        result[key as keyof ProfileFormData] = true;

        return result;
      },
      {} as Partial<Record<keyof ProfileFormData, boolean>>,
    );

    setTouched(allTouched);

    if (validation.invalidEducationIndex !== -1) {
      toast.error(
        lang === "ja"
          ? `学歴${validation.invalidEducationIndex + 1}: 学校名は必須です`
          : `Education ${
              validation.invalidEducationIndex + 1
            }: School name is required`,
      );

      return;
    }

    if (validation.invalidEmploymentIndex !== -1) {
      toast.error(
        lang === "ja"
          ? `職歴${validation.invalidEmploymentIndex + 1}: 会社名は必須です`
          : `Employment ${
              validation.invalidEmploymentIndex + 1
            }: Company name is required`,
      );

      return;
    }

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

      const data = await updateJobSeekerProfile({
        formData,
        education,
        employmentHistory,
      });

      if (data.status !== "success") {
        throw new Error(data.message || "Failed to update profile");
      }

      populateProfile(data);

      setIsEditing(false);
      setTouched({});

      toast.success(
        lang === "ja"
          ? "プロフィールを更新しました"
          : "Profile updated successfully",
      );
    } catch (error: unknown) {
      console.error("Error updating profile:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message ||
            (lang === "ja"
              ? "プロフィールの更新に失敗しました"
              : "Failed to update profile"),
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "プロフィールの更新に失敗しました"
          : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        lang === "ja"
          ? "PDF、DOC、またはDOCXファイルのみアップロード可能です"
          : "Only PDF, DOC and DOCX files are allowed",
      );

      return;
    }

    if (file.size > maxSize) {
      toast.error(
        lang === "ja"
          ? "ファイルサイズは5MB以下にしてください"
          : "File size must be less than 5MB",
      );

      return;
    }

    try {
      setUploadingResume(true);

      const data = await uploadJobSeekerResume(file);

      if (data.status !== "success") {
        throw new Error(data.message || "Failed to upload resume");
      }

      populateProfile(data);

      toast.success(
        lang === "ja"
          ? "履歴書をアップロードしました"
          : "Resume uploaded successfully",
      );
    } catch (error: unknown) {
      console.error("Resume upload error:", error);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message ||
            (lang === "ja"
              ? "履歴書のアップロードに失敗しました"
              : "Failed to upload resume"),
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "履歴書のアップロードに失敗しました"
          : "Failed to upload resume",
      );
    } finally {
      setUploadingResume(false);
    }
  };

  const cancelEdit = async () => {
    setErrors({});
    setTouched({});
    setIsEditing(false);

    await fetchProfile();
  };

  const getFieldError = (field: keyof ProfileFormData) => {
    if (touched[field] || isEditing) {
      return errors[field];
    }

    return undefined;
  };

  const isFieldMissing = (field: string) => {
    return profileStatus.missingFields.some(
      (missingField) => missingField.field === field,
    );
  };

  return {
    lang,

    profile,
    profileStatus,

    education,
    employmentHistory,

    formData,

    loading,
    saving,
    uploadingResume,
    isEditing,

    setIsEditing,

    handleInputChange,
    handleBlur,

    addEducationRecord,
    removeEducationRecord,
    updateEducationRecord,

    addEmploymentRecord,
    removeEmploymentRecord,
    updateEmploymentRecord,

    saveProfile,
    fetchProfile,
    cancelEdit,

    handleResumeUpload,

    getFieldError,
    isFieldMissing,
  };
};
