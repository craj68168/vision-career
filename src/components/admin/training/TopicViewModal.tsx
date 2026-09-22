"use client";

import {
  CalendarDays,
  ExternalLink,
  File,
  FileText,
  Folder,
  Hash,
  Trash2,
  X,
} from "lucide-react";

import type { TrainingFile, TrainingStatus, TrainingTopic } from "./types";

type Props = {
  isOpen: boolean;

  onClose: () => void;

  topic: TrainingTopic;

  lang: string;

  getStatusLabel: (status: TrainingStatus) => {
    label: string;

    color: string;

    darkColor?: string;
  };

  getFileIcon: (fileType: string) => React.ReactNode;

  getFileTypeLabel: (fileType: string) => string;

  formatDate: (date: string) => string;

  formatFileSize: (size: number | null) => string;

  handleDelete: (fileId: string) => void;

  handleView: (file: TrainingFile) => void;
};

export function TopicViewModal({
  isOpen,
  onClose,
  topic,
  lang,
  getStatusLabel,
  getFileIcon,
  getFileTypeLabel,
  formatDate,
  formatFileSize,
  handleDelete,
  handleView,
}: Props) {
  if (!isOpen) {
    return null;
  }

  const status = getStatusLabel(topic.status);

  const files = topic.files ?? [];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">
              {lang === "ja" ? "トレーニングトピック" : "Training Topic"}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold">{topic.title}</h2>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.color} ${
                  status.darkColor ?? ""
                }`}
              >
                {status.label}
              </span>
            </div>

            {topic.description && (
              <p className="mt-2 text-sm text-slate-500">{topic.description}</p>
            )}
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info
              icon={<Hash className="h-4 w-4" />}
              label="Topic ID"
              value={topic.id}
            />

            <Info
              icon={<Folder className="h-4 w-4" />}
              label={lang === "ja" ? "カテゴリー" : "Category"}
              value={topic.category_name || topic.category_id}
            />

            <Info
              icon={<Hash className="h-4 w-4" />}
              label={lang === "ja" ? "並び順" : "Sort Order"}
              value={String(topic.sort_order)}
            />

            <Info
              icon={<FileText className="h-4 w-4" />}
              label={lang === "ja" ? "ファイル" : "Files"}
              value={String(files.length)}
            />

            <Info
              icon={<CalendarDays className="h-4 w-4" />}
              label={lang === "ja" ? "作成日" : "Created"}
              value={formatDate(topic.created_at)}
            />

            <Info
              icon={<CalendarDays className="h-4 w-4" />}
              label={lang === "ja" ? "更新日" : "Updated"}
              value={formatDate(topic.updated_at)}
            />
          </div>

          <section>
            <h3 className="font-bold">
              {lang === "ja" ? "添付ファイル" : "Attached Files"}
            </h3>

            {files.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
                <File className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-3 text-sm text-slate-500">
                  {lang === "ja"
                    ? "ファイルはありません。"
                    : "No files attached to this topic."}
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 gap-3">
                      <div className="mt-1">{getFileIcon(file.file_type)}</div>

                      <div className="min-w-0">
                        <p className="font-semibold">{file.file_title}</p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {file.file_name}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>{getFileTypeLabel(file.file_type)}</span>

                          {file.file_size !== null && (
                            <span>{formatFileSize(file.file_size)}</span>
                          )}

                          <span>
                            {lang === "ja" ? "並び順" : "Sort"}:{" "}
                            {file.sort_order}
                          </span>

                          <span>{formatDate(file.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleView(file)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />

                        {lang === "ja" ? "表示" : "View"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(file.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />

                        {lang === "ja" ? "削除" : "Delete"}
                      </button>
                    </div>
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

function Info({
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

          <p className="mt-1 break-all text-sm font-medium">{value || "-"}</p>
        </div>
      </div>
    </div>
  );
}
