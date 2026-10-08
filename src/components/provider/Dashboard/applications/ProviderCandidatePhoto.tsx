"use client";

import { useEffect, useState } from "react";

import { Loader2, UserRound } from "lucide-react";

import { getProviderApplicationPhoto } from "./api";

// ======================================================
// PROPS
// ======================================================

type Props = {
  applicationId: string;

  photoAvailable?: boolean;

  candidateName?: string | null;

  size?: "sm" | "md" | "lg";

  className?: string;
};

// ======================================================
// PHOTO STATE
// ======================================================

type PhotoState = {
  applicationId: string;
  url: string | null;
  failed: boolean;
};

// ======================================================
// SIZE
// ======================================================

const SIZE_CLASSES = {
  sm: {
    container: "h-12 w-12",
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
// PROVIDER CANDIDATE PHOTO
// ======================================================

export default function ProviderCandidatePhoto({
  applicationId,
  photoAvailable = false,
  candidateName,
  size = "md",
  className = "",
}: Props) {
  const [photoState, setPhotoState] = useState<PhotoState | null>(null);

  const sizeClasses = SIZE_CLASSES[size];

  // ====================================================
  // CURRENT PHOTO STATE
  // ====================================================

  const currentPhotoState =
    photoState?.applicationId === applicationId ? photoState : null;

  const photoUrl = currentPhotoState?.url ?? null;

  const failed = currentPhotoState?.failed ?? false;

  const loading =
    photoAvailable && Boolean(applicationId) && !currentPhotoState;

  // ====================================================
  // LOAD AUTHENTICATED PHOTO
  // ====================================================

  useEffect(() => {
    if (!photoAvailable || !applicationId) {
      return;
    }

    let active = true;
    let currentObjectUrl: string | null = null;

    const loadPhoto = async () => {
      try {
        const blob = await getProviderApplicationPhoto(applicationId);

        if (!active) {
          return;
        }

        // =================================================
        // VALIDATE RESPONSE
        // =================================================

        if (!blob || blob.size === 0) {
          throw new Error("Candidate photo response is empty.");
        }

        if (blob.type && !blob.type.startsWith("image/")) {
          throw new Error("Invalid candidate photo response.");
        }

        currentObjectUrl = URL.createObjectURL(blob);

        if (!active) {
          URL.revokeObjectURL(currentObjectUrl);
          return;
        }

        setPhotoState({
          applicationId,
          url: currentObjectUrl,
          failed: false,
        });
      } catch (error) {
        console.error("Load provider candidate photo error:", error);

        if (!active) {
          return;
        }

        setPhotoState({
          applicationId,
          url: null,
          failed: true,
        });
      }
    };

    void loadPhoto();

    // ====================================================
    // CLEANUP
    // ====================================================

    return () => {
      active = false;

      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [applicationId, photoAvailable]);

  // ====================================================
  // NO PHOTO / FAILED
  // ====================================================

  if (!photoAvailable || failed) {
    return (
      <div
        title={candidateName || "Candidate"}
        className={[
          "flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-slate-400",
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
          "flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-400",
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
          "shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100",
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
        "flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-slate-400",
        sizeClasses.container,
        className,
      ].join(" ")}
    >
      <UserRound className={sizeClasses.icon} />
    </div>
  );
}
