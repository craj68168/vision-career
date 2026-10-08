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
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(photoAvailable);

  const [failed, setFailed] = useState(false);

  const sizeClasses = SIZE_CLASSES[size];

  // ====================================================
  // LOAD AUTHENTICATED PHOTO
  // ====================================================

  useEffect(() => {
    if (!photoAvailable) {
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

        if (!blob.type.startsWith("image/")) {
          throw new Error("Invalid candidate photo response.");
        }

        currentObjectUrl = URL.createObjectURL(blob);

        if (!active) {
          URL.revokeObjectURL(currentObjectUrl);

          return;
        }

        setPhotoUrl(currentObjectUrl);
      } catch (error) {
        console.error("Load provider candidate photo error:", error);

        if (active) {
          setFailed(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPhoto();

    // ====================================================
    // CLEANUP BLOB URL
    // ====================================================

    return () => {
      active = false;

      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [applicationId, photoAvailable]);

  // ====================================================
  // FALLBACK
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
        className={[
          "shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100",

          sizeClasses.container,

          className,
        ].join(" ")}
      >
        {/* Blob URL is created from authenticated API response. */}
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
