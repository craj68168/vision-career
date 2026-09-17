"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  createAdminSeeker,
  deleteAdminSeeker,
  downloadAdminSeekerResume,
  getAdminSeekerById,
  getAdminSeekers,
  updateAdminSeeker,
  updateAdminSeekerAccountStatus,
  updateAdminSeekerApproval,
  updateAdminSeekerPlacementStatus,
} from "./api";

import type {
  AccountStatus,
  AdminSeeker,
  ApiErrorResponse,
  ApprovalStatus,
  CreateSeekerPayload,
  EditSeekerPayload,
  PlacementStatus,
  SeekerSummary,
} from "./types";

const emptySummary: SeekerSummary = {
  total: 0,
  active: 0,
  inactive: 0,
  suspended: 0,

  approval: {
    pending: 0,
    approved: 0,
    rejected: 0,
  },
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const useAdminJobSeekers = () => {
  // ====================================================
  // DATA
  // ====================================================

  const [seekers, setSeekers] = useState<AdminSeeker[]>([]);

  const [summary, setSummary] = useState<SeekerSummary>(emptySummary);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);

  const [totalRecords, setTotalRecords] = useState(0);

  // ====================================================
  // FILTERS
  // ====================================================

  const [search, setSearchState] = useState("");

  const [approvalStatus, setApprovalStatusState] = useState<
    "" | ApprovalStatus
  >("");

  const [accountStatus, setAccountStatusState] = useState<"" | AccountStatus>(
    "",
  );

  const [placementStatus, setPlacementStatusState] = useState<
    "" | PlacementStatus
  >("");

  // ====================================================
  // PAGE STATE
  // ====================================================

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // ====================================================
  // MODALS
  // ====================================================

  const [createOpen, setCreateOpen] = useState(false);

  const [viewingSeeker, setViewingSeeker] = useState<AdminSeeker | null>(null);

  const [editingSeeker, setEditingSeeker] = useState<AdminSeeker | null>(null);

  const [approvalSeeker, setApprovalSeeker] = useState<AdminSeeker | null>(
    null,
  );

  const [deletingSeeker, setDeletingSeeker] = useState<AdminSeeker | null>(
    null,
  );

  // ====================================================
  // ACTION STATE
  // ====================================================

  const [isSaving, setIsSaving] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);

  // ====================================================
  // LOAD LIST
  // ====================================================

  const loadSeekers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getAdminSeekers({
        search,
        approvalStatus,
        accountStatus,
        placementStatus,
        page,
        limit,
      });

      setSeekers(response.data);
      setSummary(response.summary);

      setTotalPages(response.pagination.pages);

      setTotalRecords(response.pagination.total);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Failed to load job seekers."));
    } finally {
      setIsLoading(false);
    }
  }, [search, approvalStatus, accountStatus, placementStatus, page, limit]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadSeekers();
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [loadSeekers]);

  // ====================================================
  // FILTER HELPERS
  // ====================================================

  const setSearch = (value: string) => {
    setPage(1);
    setSearchState(value);
  };

  const setApprovalStatus = (value: "" | ApprovalStatus) => {
    setPage(1);
    setApprovalStatusState(value);
  };

  const setAccountStatus = (value: "" | AccountStatus) => {
    setPage(1);
    setAccountStatusState(value);
  };

  const setPlacementStatus = (value: "" | PlacementStatus) => {
    setPage(1);
    setPlacementStatusState(value);
  };

  const changeLimit = (value: number) => {
    setPage(1);
    setLimit(value);
  };

  // ====================================================
  // GET FRESH SEEKER
  // ====================================================

  const fetchSeeker = async (seekerId: string) => {
    const response = await getAdminSeekerById(seekerId);

    return response.data;
  };

  // ====================================================
  // VIEW
  // ====================================================

  const openView = async (seeker: AdminSeeker) => {
    try {
      setActionError(null);

      const fresh = await fetchSeeker(seeker.seeker_id);

      setViewingSeeker(fresh);
    } catch (viewError) {
      toast.error(getErrorMessage(viewError, "Failed to load seeker."));
    }
  };

  // ====================================================
  // EDIT
  // ====================================================

  const openEdit = async (seeker: AdminSeeker) => {
    try {
      setActionError(null);

      const fresh = await fetchSeeker(seeker.seeker_id);

      setEditingSeeker(fresh);
    } catch (editError) {
      toast.error(getErrorMessage(editError, "Failed to load seeker."));
    }
  };

  // ====================================================
  // CREATE
  // ====================================================

  const handleCreate = async (payload: CreateSeekerPayload) => {
    try {
      setIsSaving(true);
      setActionError(null);

      await createAdminSeeker(payload);

      toast.success("Job seeker created successfully.");

      setCreateOpen(false);

      await loadSeekers();
    } catch (createError) {
      const message = getErrorMessage(
        createError,
        "Failed to create job seeker.",
      );

      setActionError(message);

      throw new Error(message);
    } finally {
      setIsSaving(false);
    }
  };

  // ====================================================
  // EDIT
  // ====================================================

  const handleEdit = async ({
    profile,
    accountStatus: nextAccountStatus,
    placementStatus: nextPlacementStatus,
  }: {
    profile: EditSeekerPayload;
    accountStatus: AccountStatus;
    placementStatus: PlacementStatus;
  }) => {
    if (!editingSeeker) return;

    try {
      setIsSaving(true);
      setActionError(null);

      const seekerId = editingSeeker.seeker_id;

      await updateAdminSeeker(seekerId, profile);

      if (nextAccountStatus !== editingSeeker.account_status) {
        await updateAdminSeekerAccountStatus(seekerId, {
          status: nextAccountStatus,
        });
      }

      if (nextPlacementStatus !== editingSeeker.placement_status) {
        await updateAdminSeekerPlacementStatus(seekerId, {
          status: nextPlacementStatus,
        });
      }

      toast.success("Job seeker updated successfully.");

      setEditingSeeker(null);

      await loadSeekers();
    } catch (editError) {
      const message = getErrorMessage(
        editError,
        "Failed to update job seeker.",
      );

      setActionError(message);

      throw new Error(message);
    } finally {
      setIsSaving(false);
    }
  };

  // ====================================================
  // APPROVE / REJECT
  // ====================================================

  const handleApproval = async (
    decision: "approved" | "rejected",
    reason?: string,
  ) => {
    if (!approvalSeeker) return;

    try {
      setIsSaving(true);
      setActionError(null);

      await updateAdminSeekerApproval(approvalSeeker.seeker_id, {
        decision,
        reason,
      });

      toast.success(
        decision === "approved"
          ? "Job seeker approved."
          : "Job seeker rejected.",
      );

      setApprovalSeeker(null);

      await loadSeekers();
    } catch (approvalError) {
      const message = getErrorMessage(
        approvalError,
        "Failed to update approval.",
      );

      setActionError(message);

      throw new Error(message);
    } finally {
      setIsSaving(false);
    }
  };

  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = async () => {
    if (!deletingSeeker) return;

    try {
      setIsDeleting(true);
      setActionError(null);

      await deleteAdminSeeker(deletingSeeker.seeker_id);

      toast.success("Job seeker deleted.");

      setDeletingSeeker(null);

      await loadSeekers();
    } catch (deleteError) {
      setActionError(
        getErrorMessage(deleteError, "Failed to delete job seeker."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ====================================================
  // RESUME
  // ====================================================

  const handleDownloadResume = async (seeker: AdminSeeker) => {
    try {
      setIsDownloading(true);

      await downloadAdminSeekerResume(seeker);
    } catch (downloadError) {
      toast.error(getErrorMessage(downloadError, "Failed to download resume."));
    } finally {
      setIsDownloading(false);
    }
  };

  // ====================================================
  // REFRESH
  // ====================================================

  const handleRefresh = async () => {
    await loadSeekers();
  };

  return {
    seekers,
    summary,

    search,
    approvalStatus,
    accountStatus,
    placementStatus,

    page,
    limit,
    totalPages,
    totalRecords,

    isLoading,
    error,

    createOpen,
    viewingSeeker,
    editingSeeker,
    approvalSeeker,
    deletingSeeker,

    isSaving,
    isDeleting,
    isDownloading,
    actionError,

    setSearch,
    setApprovalStatus,
    setAccountStatus,
    setPlacementStatus,

    setPage,
    changeLimit,

    setCreateOpen,
    setViewingSeeker,
    setEditingSeeker,
    setApprovalSeeker,
    setDeletingSeeker,

    setActionError,

    openView,
    openEdit,

    handleCreate,
    handleEdit,
    handleApproval,
    handleDelete,
    handleDownloadResume,
    handleRefresh,
  };
};
