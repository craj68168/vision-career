"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useLanguage } from "@/context/LanguageContext";
import { getJobSeekerProfile } from "../Profile/api";
import type {
  ApiErrorResponse,
  EducationRecord,
  EmploymentRecord,
  JobSeekerProfile,
  MissingField,
} from "../Profile/types";

dayjs.extend(utc);

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = dayjs.utc(value);
  if (!date.isValid()) return "-";
  return date.format("YYYY-MM-DD");
};

export const useJobSeekerProfileView = () => {
  const router = useRouter();
  const { lang } = useLanguage();
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [education, setEducation] = useState<EducationRecord[]>([]);
  const [employmentHistory, setEmploymentHistory] = useState<
    EmploymentRecord[]
  >([]);
  const [isComplete, setIsComplete] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState<MissingField[]>([]);
  const [loading, setLoading] = useState(true);
  const loadProfile = useCallback(async () => {
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
      setProfile(data.profile);
      setEducation(data.education || []);
      setEmploymentHistory(data.employment_history || []);
      setIsComplete(data.is_complete);
      setCompletionPercentage(data.completion_percentage);
      setMissingFields(data.missing_fields || []);
    } catch (error: unknown) {
      console.error("Profile view error:", error);
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_role");
          router.replace(
            lang === "ja" ? "/job-seekers-auth" : "/en/job-seekers-auth",
          );
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
  }, [lang, router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const editProfile = () => {
    router.push(
      lang === "ja" ? "/job-seekers/profile" : "/en/job-seekers/profile",
    );
  };

  const backToDashboard = () => {
    router.push(lang === "ja" ? "/job-seekers" : "/en/job-seekers");
  };

  return {
    lang,
    profile,
    education,
    employmentHistory,
    isComplete,
    completionPercentage,
    missingFields,
    loading,
    formatDate,
    editProfile,
    backToDashboard,
  };
};
