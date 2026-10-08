"use client";

import { useEffect, useState } from "react";

import { Loader2, UserRound } from "lucide-react";

import axiosInstance from "@/services/axiosInstance";

// ======================================================
// PROPS
// ======================================================

type Props = {
  placementCandidateId: string;

  photoAvailable?: boolean;

  candidateName?: string | null;

  size?: "sm" | "md" | "lg";

  className?: string;
};

// ======================================================
// PHOTO STATE
// ======================================================

type PhotoState = {
  placementCandidateId: string;

  url: string | null;

  failed: boolean;
};

// ======================================================
// SIZE
// ======================================================

const SIZE_CLASSES = {
  sm: {
    container: "h-11 w-11",

    icon: "h-5 w-5",
  },

  md: {
    container: "h-16 w-16",

    icon: "h-6 w-6",
  },

  lg: {
    container: "h-24 w-24",

    icon: "h-8 w-8",
  },
};

// ======================================================
// PHOTO API
// ======================================================

const getProviderPlacementCandidatePhoto = async (
  placementCandidateId: string,
) => {
  const response = await axiosInstance.get<Blob>(
    `/providers/placement-candidates/${placementCandidateId}/photo`,
    {
      responseType: "blob",
    },
  );

  return response.data;
};

// ======================================================
// COMPONENT
// ======================================================

export default function ProviderPlacementCandidatePhoto({
  placementCandidateId,

  photoAvailable = false,

  candidateName,

  size = "sm",

  className = "",
}: Props) {
  const [photoState, setPhotoState] = useState<PhotoState | null>(null);

  const sizeClasses = SIZE_CLASSES[size];

  // ====================================================
  // CURRENT STATE
  // ====================================================

  const currentPhotoState =
    photoState?.placementCandidateId === placementCandidateId
      ? photoState
      : null;

  const photoUrl = currentPhotoState?.url ?? null;

  const failed = currentPhotoState?.failed ?? false;

  const loading =
    photoAvailable && Boolean(placementCandidateId) && !currentPhotoState;

  // ====================================================
  // LOAD PHOTO
  // ====================================================

  useEffect(() => {
    if (!photoAvailable || !placementCandidateId) {
      return;
    }

    let active = true;

    let objectUrl: string | null = null;

    const loadPhoto = async () => {
      try {
        const blob =
          await getProviderPlacementCandidatePhoto(placementCandidateId);

        if (!active) {
          return;
        }

        if (!blob || blob.size === 0) {
          throw new Error("Candidate photo response is empty.");
        }

        if (blob.type && !blob.type.startsWith("image/")) {
          throw new Error("Invalid candidate photo response.");
        }

        objectUrl = URL.createObjectURL(blob);

        if (!active) {
          URL.revokeObjectURL(objectUrl);

          return;
        }

        setPhotoState({
          placementCandidateId,

          url: objectUrl,

          failed: false,
        });
      } catch (error) {
        console.error("Load placement candidate photo error:", error);

        if (!active) {
          return;
        }

        setPhotoState({
          placementCandidateId,

          url: null,

          failed: true,
        });
      }
    };

    void loadPhoto();

    return () => {
      active = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [placementCandidateId, photoAvailable]);

  // ====================================================
  // FALLBACK
  // ====================================================

  if (!photoAvailable || failed) {
    return (
      <div
        title={candidateName || "Candidate"}
        className={[
          "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-indigo-50 text-indigo-600",

          sizeClasses.container,

          className,
        ].join(" ")}
      >
        <UserRound className={sizeClasses.icon} />
      </div>
    );
  }

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div
        title={candidateName || "Candidate"}
        className={[
          "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-slate-400",

          sizeClasses.container,

          className,
        ].join(" ")}
      >
        <Loader2 className={`${sizeClasses.icon} animate-spin`} />
      </div>
    );
  }

  // ====================================================
  // PHOTO
  // ====================================================

  if (photoUrl) {
    return (
      <div
        title={candidateName || "Candidate"}
        className={[
          "shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100",

          sizeClasses.container,

          className,
        ].join(" ")}
      >
        <img
          src={photoUrl}
          alt={candidateName ? `${candidateName} profile` : "Candidate profile"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  // ====================================================
  // FINAL FALLBACK
  // ====================================================

  return (
    <div
      title={candidateName || "Candidate"}
      className={[
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-indigo-50 text-indigo-600",

        sizeClasses.container,

        className,
      ].join(" ")}
    >
      <UserRound className={sizeClasses.icon} />
    </div>
  );
}
