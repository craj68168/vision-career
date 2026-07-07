"use client";

import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

export interface CompanyPlacementCandidate {
  placement_request_candidate_id: number;
  placement_request_id: number;
  job_seeker_id: number;
  candidate_status: string;
  company_feedback: string | null;
  interview_date: string | null;
  result_date: string | null;
  candidate_created_at: string;
  candidate_updated_at: string;

  // Job Seeker Info
  job_seeker_name: string;
  job_seeker_email: string;
  job_seeker_phone: string;
  job_seeker_address: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  visa_type: string | null;
  visa_expiry_date: string | null;
  japanese_level: string | null;
  desired_job: string | null;
  desired_location: string | null;
  available_from: string | null;
  resume_file: string | null;
  job_seeker_placement_status: string | null;

  // Placement Request Info
  request_id: number;
  job_title: string;
  job_category: string | null;
  employment_type: string | null;
  number_of_positions: number;
  work_location: string | null;
  japanese_level_required: string | null;
  visa_type_required: string | null;
  salary_type: string | null;
  salary_amount: number | null;
  start_date: string | null;
  request_status: string;
}

export interface CompanyPlacementCandidatesResponse {
  success: boolean;
  data: CompanyPlacementCandidate[];
  placement_request: {
    id: number;
    company_id: number;
    job_title: string;
    job_category: string | null;
    employment_type: string | null;
    work_location: string | null;
    request_status: string;
  };
  filters: {
    placement_request_id: number;
    candidate_status: string;
    keyword: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export const COMPANY_CANDIDATE_STATUSES = {
  sent_to_company: {
    label: { en: "Sent to Company", ja: "企業送信済み" },
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  interview_requested: {
    label: { en: "Interview Requested", ja: "面接依頼中" },
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  interview_scheduled: {
    label: { en: "Interview Scheduled", ja: "面接予定" },
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  interviewed: {
    label: { en: "Interviewed", ja: "面接済み" },
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  selected: {
    label: { en: "Selected", ja: "選考通過" },
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: { en: "Rejected", ja: "不合格" },
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
  joined: {
    label: { en: "Joined", ja: "入社済み" },
    color: "bg-green-100 text-green-700 border-green-200",
  },
};

export const COMPANY_ACTIONABLE_STATUSES = [
  {
    value: "interview_requested",
    label: { en: "Request Interview", ja: "面接を依頼" },
  },
  { value: "selected", label: { en: "Select Candidate", ja: "候補者を選考" } },
  { value: "rejected", label: { en: "Reject", ja: "不合格" } },
];

export function useCompanyPlacementCandidates() {
  const { lang } = useLanguage();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const fetchCandidates = useCallback(
    async (
      placementRequestId: number,
      candidateStatus: string = "sent_to_company",
      keyword: string = "",
      page: number = 1,
      limit: number = 20,
    ): Promise<CompanyPlacementCandidatesResponse> => {
      if (!token) {
        throw new Error("Authentication required");
      }

      const params = new URLSearchParams({
        placement_request_id: String(placementRequestId),
        candidate_status: candidateStatus,
        page: String(page),
        limit: String(limit),
      });

      if (keyword) {
        params.append("keyword", keyword);
      }

      const response = await fetch(
        `https://vision-career.co.jp/get-company-placement-request-candidates.php?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Failed to fetch candidates");
      }

      return data;
    },
    [token],
  );

  const updateCandidateStatus = useCallback(
    async (
      placementRequestCandidateId: number,
      candidateStatus: string,
      companyFeedback?: string,
    ) => {
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        "https://vision-career.co.jp/company-update-placement-candidate-status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            placement_request_candidate_id: placementRequestCandidateId,
            candidate_status: candidateStatus,
            company_feedback: companyFeedback || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Failed to update candidate status");
      }

      return data;
    },
    [token],
  );

  return {
    fetchCandidates,
    updateCandidateStatus,
  };
}
