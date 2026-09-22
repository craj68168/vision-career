"use client";

import {
  CalendarDays,
  ExternalLink,
  File,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Image,
  Presentation,
  Video,
  X,
} from "lucide-react";

import {
  formatStaffTrainingDate,
  formatStaffTrainingFileSize,
  getStaffTrainingFileTypeLabel,
} from "./helper";

import type { StaffTrainingFile, StaffTrainingTopic } from "./types";

// ======================================================
// PROPS
// ======================================================

type Props = {
  topic: StaffTrainingTopic | null;

  onClose: () => void;

  onOpenFile: (file: StaffTrainingFile) => void;
};

// ======================================================
// COMPONENT
// ======================================================

export default function TopicDetailsModal({
  topic,

  onClose,

  onOpenFile,
}: Props) {
  if (!topic) {
    return null;
  }

  const files = topic.files ?? [];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Training Topic
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {topic.title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {topic.categoryName || topic.categoryId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-6">
          {/* DESCRIPTION */}

          {topic.description && (
            <section className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">Description</h3>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {topic.description}
              </p>
            </section>
          )}

          {/* INFO */}

          <div className="grid gap-4 sm:grid-cols-3">
            <InfoBox
              icon={<FolderOpen className="h-4 w-4" />}
              label="Category"
              value={topic.categoryName || topic.categoryId}
            />

            <InfoBox
              icon={<FileText className="h-4 w-4" />}
              label="Files"
              value={String(topic.filesCount)}
            />

            <InfoBox
              icon={<CalendarDays className="h-4 w-4" />}
              label="Updated"
              value={formatStaffTrainingDate(topic.updatedAt)}
            />
          </div>

          {/* FILES */}

          <section>
            <h3 className="text-lg font-bold">Training Materials</h3>

            {files.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
                <File className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-3 text-sm text-slate-500">
                  No training files are attached to this topic.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {files.map((file) => (
                  <div
                    key={file.fileId}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-1">
                        <FileTypeIcon type={file.fileType} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {file.fileTitle}
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {file.fileName}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>
                            {getStaffTrainingFileTypeLabel(file.fileType)}
                          </span>

                          <span>
                            {formatStaffTrainingFileSize(file.fileSize)}
                          </span>

                          <span>{formatStaffTrainingDate(file.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenFile(file)}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// INFO BOX
// ======================================================

function InfoBox({
  icon,

  label,

  value,
}: {
  icon: React.ReactNode;

  label: string;

  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 text-slate-400">{icon}</div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// FILE ICON
// ======================================================

function FileTypeIcon({ type }: { type: StaffTrainingFile["fileType"] }) {
  switch (type) {
    case "pdf":
      return <FileText className="h-6 w-6 text-red-500" />;

    case "video":
      return <Video className="h-6 w-6 text-purple-500" />;

    case "image":
      return <Image className="h-6 w-6 text-blue-500" />;

    case "excel":
      return <FileSpreadsheet className="h-6 w-6 text-emerald-600" />;

    case "ppt":
      return <Presentation className="h-6 w-6 text-orange-500" />;

    case "doc":
      return <FileText className="h-6 w-6 text-blue-600" />;

    default:
      return <File className="h-6 w-6 text-slate-500" />;
  }
}
