"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
  getProviderPlacementInterviewByCandidateId,
  schedulePlacementInterview,
  updatePlacementInterview,
} from "./placementInterviewApi";

import type {
  PlacementInterview,
  PlacementInterviewApiError,
  PlacementInterviewFormPayload,
  PlacementInterviewMethod,
} from "./placementInterviewTypes";

// ======================================================
// PROPS
// ======================================================

type Props = {
  placementCandidateId: string;

  interview?: PlacementInterview | null;

  lang: string;

  onSuccess: () => void | Promise<void>;

  onClose: () => void;
};

// ======================================================
// DATE
// ======================================================

const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getUTCFullYear();

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ======================================================
// HOOK
// ======================================================

export const usePlacementInterview = ({
  placementCandidateId,

  interview,

  lang,

  onSuccess,

  onClose,
}: Props) => {
  // ====================================================
  // EDIT MODE
  // ====================================================

  const isEdit = Boolean(interview);

  // ====================================================
  // FORM STATE
  //
  // IMPORTANT:
  //
  // Values are initialized directly from props.
  //
  // We do NOT use useEffect to copy props into state.
  //
  // This fixes:
  //
  // "Calling setState synchronously within an effect..."
  //
  // The interview modal is mounted per candidate/interview,
  // so lazy initial state is the correct pattern here.
  // ====================================================

  const [interviewDate, setInterviewDate] = useState(() =>
    toDateInputValue(interview?.interviewDate),
  );

  const [interviewTime, setInterviewTime] = useState(
    () => interview?.interviewTime || "",
  );

  const [timezone, setTimezone] = useState(
    () => interview?.timezone || "Asia/Tokyo",
  );

  const [interviewMethod, setInterviewMethod] =
    useState<PlacementInterviewMethod>(
      () => interview?.interviewMethod || "ZOOM",
    );

  const [meetingLink, setMeetingLink] = useState(
    () => interview?.meetingLink || "",
  );

  const [notes, setNotes] = useState(() => interview?.notes || "");

  const [validationError, setValidationError] = useState("");

  const [saving, setSaving] = useState(false);

  // ====================================================
  // ONLINE INTERVIEW
  // ====================================================

  const onlineInterview =
    interviewMethod === "ZOOM" || interviewMethod === "GOOGLE_MEET";

  // ====================================================
  // VALIDATE
  // ====================================================

  const validate = () => {
    if (!interviewDate) {
      return lang === "ja"
        ? "面接日を選択してください。"
        : "Interview date is required.";
    }

    if (!interviewTime) {
      return lang === "ja"
        ? "面接時間を選択してください。"
        : "Interview time is required.";
    }

    if (!timezone.trim()) {
      return lang === "ja"
        ? "タイムゾーンを入力してください。"
        : "Timezone is required.";
    }

    if (meetingLink.trim().length > 2000) {
      return lang === "ja"
        ? "ミーティングリンクが長すぎます。"
        : "Meeting link is too long.";
    }

    if (notes.trim().length > 2000) {
      return lang === "ja"
        ? "備考は2000文字以内で入力してください。"
        : "Notes cannot exceed 2000 characters.";
    }

    return "";
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async () => {
    setValidationError("");

    const validationMessage = validate();

    if (validationMessage) {
      setValidationError(validationMessage);

      return;
    }

    const payload: PlacementInterviewFormPayload = {
      interviewDate,

      interviewTime,

      timezone: timezone.trim(),

      interviewMethod,

      meetingLink: onlineInterview ? meetingLink.trim() : "",

      notes: notes.trim(),
    };

    try {
      setSaving(true);

      // ===============================================
      // SAFETY CHECK
      //
      // If parent did not already load an existing
      // interview, check Provider interviews before
      // POSTing a new interview.
      //
      // This prevents duplicate placement interviews.
      // ===============================================

      let existingInterview = interview ?? null;

      if (!existingInterview) {
        existingInterview =
          await getProviderPlacementInterviewByCandidateId(
            placementCandidateId,
          );
      }

      // ===============================================
      // UPDATE OR CREATE
      // ===============================================

      const response = existingInterview
        ? await updatePlacementInterview(
            existingInterview.interviewId,

            payload,
          )
        : await schedulePlacementInterview(
            placementCandidateId,

            payload,
          );

      // ===============================================
      // SUCCESS MESSAGE
      // ===============================================

      const updatedExisting = Boolean(existingInterview);

      toast.success(
        response.message ||
          (updatedExisting
            ? lang === "ja"
              ? "面接情報を更新しました。"
              : "Interview updated successfully."
            : lang === "ja"
              ? "面接を設定しました。"
              : "Interview scheduled successfully."),
      );

      // ===============================================
      // REFRESH PARENT
      // ===============================================

      await onSuccess();

      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError<PlacementInterviewApiError>(error)) {
        toast.error(
          error.response?.data?.message ||
            (lang === "ja"
              ? "面接の保存に失敗しました。"
              : "Failed to save interview."),
        );

        return;
      }

      toast.error(
        lang === "ja"
          ? "面接の保存に失敗しました。"
          : "Failed to save interview.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // RETURN
  // ====================================================

  return {
    isEdit,

    interviewDate,

    setInterviewDate,

    interviewTime,

    setInterviewTime,

    timezone,

    setTimezone,

    interviewMethod,

    setInterviewMethod,

    meetingLink,

    setMeetingLink,

    notes,

    setNotes,

    validationError,

    saving,

    onlineInterview,

    handleSubmit,
  };
};
