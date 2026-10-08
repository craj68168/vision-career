"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import toast from "react-hot-toast";

import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

import axiosInstance from "@/services/axiosInstance";

type Language = "ja" | "en";

type Props = {
  vacancyId: string;
  language: Language;
  vacancyTitle?: string;
  companyName?: string;
};

type ApplicationResponse = {
  success: boolean;

  message?: string;

  data?: {
    applicationId: string;
    vacancyId: string;
    status: string;
    appliedAt: string;
  };
};

type ApplicationError = {
  success?: boolean;
  status?: string;
  message?: string;

  data?: {
    placement_eligible?: boolean;
    profile_complete?: boolean;
    completion_percentage?: number;

    missing_fields?: Array<{
      field: string;
      label: string;
    }>;

    reasons?: string[];
  };
};

// ======================================================
// PUBLIC JOB APPLY BUTTON
// ======================================================

export default function PublicJobApplyButton({
  vacancyId,
  language,
  vacancyTitle,
  companyName,
}: Props) {
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ====================================================
  // PATHS
  // ====================================================

  const jobPath =
    language === "en"
      ? `/en/jobs/${encodeURIComponent(vacancyId)}`
      : `/jobs/${encodeURIComponent(vacancyId)}`;

  const authPath =
    language === "en" ? "/en/job-seekers-auth" : "/job-seekers-auth";

  const dashboardPath = language === "en" ? "/en/job-seekers" : "/job-seekers";

  const loginUrl = `${authPath}?returnTo=${encodeURIComponent(jobPath)}`;

  // ====================================================
  // TEXT
  // ====================================================

  const labels =
    language === "ja"
      ? {
          apply: "この求人に応募する",

          applying: "応募中...",

          modalTitle: "この求人に応募しますか？",

          modalDescription:
            "応募すると、現在のプロフィール情報をもとに応募書類が作成され、管理者の確認に送信されます。",

          vacancy: "求人",

          company: "企業",

          cancel: "キャンセル",

          confirm: "応募する",

          success: "応募が完了しました。管理者の確認待ちです。",

          failed: "応募の送信に失敗しました。",

          alreadyApplied: "この求人には既に応募済みです。",

          loginRequired: "応募するには求職者としてログインしてください。",

          completeProfile:
            "求人に応募する前にプロフィールを完成させてください。",
        }
      : {
          apply: "Apply for this job",

          applying: "Applying...",

          modalTitle: "Apply for this job?",

          modalDescription:
            "Your current profile information will be used to prepare your application, which will then be submitted for admin review.",

          vacancy: "Position",

          company: "Company",

          cancel: "Cancel",

          confirm: "Submit application",

          success:
            "Your application has been submitted and is pending admin review.",

          failed: "Failed to submit your application.",

          alreadyApplied: "You have already applied for this job.",

          loginRequired: "Please sign in as a Job Seeker to apply.",

          completeProfile:
            "Please complete your profile before applying for jobs.",
        };

  // ====================================================
  // OPEN APPLY FLOW
  // ====================================================

  const handleApplyClick = () => {
    if (submitting) {
      return;
    }

    const token = localStorage.getItem("access_token");

    const role = localStorage.getItem("user_role");

    // --------------------------------------------------
    // NOT LOGGED IN AS JOB SEEKER
    // --------------------------------------------------

    if (!token || role !== "seeker") {
      router.push(loginUrl);

      return;
    }

    // --------------------------------------------------
    // LOGGED IN
    // --------------------------------------------------

    setConfirmOpen(true);
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const closeConfirmModal = () => {
    if (submitting) {
      return;
    }

    setConfirmOpen(false);
  };

  // ====================================================
  // SUBMIT APPLICATION
  // ====================================================

  const submitApplication = async () => {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await axiosInstance.post<ApplicationResponse>(
        "/seekers/applications",
        {
          vacancyId,
          coverLetter: null,
        },
      );

      if (!response.data.success) {
        toast.error(response.data.message || labels.failed);

        return;
      }

      // ==============================================
      // SUCCESS
      // ==============================================

      setConfirmOpen(false);

      toast.success(response.data.message || labels.success);

      // ==============================================
      // REDIRECT TO JOB SEEKER DASHBOARD
      //
      // EN:
      // /en/job-seekers
      //
      // JA:
      // /job-seekers
      // ==============================================

      router.replace(dashboardPath);

      return;
    } catch (error: unknown) {
      console.error("Public vacancy application error:", error);

      if (axios.isAxiosError<ApplicationError>(error)) {
        // ============================================
        // AUTH EXPIRED / INVALID
        // ============================================

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");

          localStorage.removeItem("user_role");

          setConfirmOpen(false);

          toast.error(labels.loginRequired);

          router.push(loginUrl);

          return;
        }

        // ============================================
        // PROFILE / PLACEMENT ELIGIBILITY
        // ============================================

        if (error.response?.data?.status === "NOT_PLACEMENT_ELIGIBLE") {
          setConfirmOpen(false);

          toast.error(error.response.data.message || labels.completeProfile);

          return;
        }

        // ============================================
        // DUPLICATE APPLICATION
        // ============================================

        if (error.response?.status === 409) {
          setConfirmOpen(false);

          toast.error(error.response.data?.message || labels.alreadyApplied);

          return;
        }

        // ============================================
        // OTHER BACKEND VALIDATION
        // ============================================

        setConfirmOpen(false);

        toast.error(error.response?.data?.message || labels.failed);

        return;
      }

      setConfirmOpen(false);

      toast.error(labels.failed);
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      <button
        type="button"
        disabled={submitting}
        onClick={handleApplyClick}
        className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <BriefcaseBusiness className="h-4 w-4" />

        {labels.apply}
      </button>

      {/* =================================================
          APPLICATION CONFIRMATION MODAL
      ================================================= */}

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="presentation"
        >
          {/* BACKDROP */}

          <button
            type="button"
            aria-label={labels.cancel}
            disabled={submitting}
            onClick={closeConfirmModal}
            className="absolute inset-0 cursor-default"
          />

          {/* MODAL */}

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="public-job-apply-title"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <BriefcaseBusiness className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <h2
                    id="public-job-apply-title"
                    className="text-lg font-bold text-slate-950"
                  >
                    {labels.modalTitle}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {labels.modalDescription}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={closeConfirmModal}
                aria-label={labels.cancel}
                className="ml-4 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* JOB INFORMATION */}

            <div className="px-6 py-5">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {vacancyTitle && (
                  <div className="flex gap-3 border-b border-slate-200 px-4 py-3">
                    <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {labels.vacancy}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {vacancyTitle}
                      </p>
                    </div>
                  </div>
                )}

                {companyName && (
                  <div className="flex gap-3 px-4 py-3">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {labels.company}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {companyName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={submitting}
                onClick={closeConfirmModal}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {labels.cancel}
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => void submitApplication()}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    {labels.applying}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />

                    {labels.confirm}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
