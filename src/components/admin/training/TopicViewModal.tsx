"use client";

import type { TrainingTopic, TrainingStatus } from "@/hooks/useTraining";
import {
  CalendarIcon,
  ClockIcon,
  Folder,
  HashIcon,
  X,
  File,
  Info,
  FileText,
  ExternalLink,
  Trash2,
} from "lucide-react";

interface TopicViewModalProps {
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
  formatDate: (dateString: string) => string;
  formatFileSize: (bytes: number | null) => string;
  handleDelete: (id: number) => void;
}

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
}: TopicViewModalProps) {
  if (!isOpen) return null;

  const statusInfo = getStatusLabel(topic.status);
  const files = topic.files || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {topic.title}
              </h3>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.color} ${statusInfo.darkColor || ""}`}
              >
                {statusInfo.label}
              </span>
            </div>
            {topic.description && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {topic.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Topic Info */}
        <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-4 md:grid-cols-2 dark:bg-slate-700/50">
          <div className="flex items-center gap-3">
            <HashIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "トピックID" : "Topic ID"}
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                #{topic.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Folder className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "カテゴリー" : "Category"}
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {topic.category_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "作成日" : "Created At"}
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {formatDate(topic.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ClockIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "更新日" : "Updated At"}
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {formatDate(topic.updated_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <File className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "ファイル数" : "Total Files"}
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {topic.files_count || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Info className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "ja" ? "スラッグ" : "Slug"}
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {topic.slug}
              </p>
            </div>
          </div>
        </div>

        {/* Files Section */}
        <div className="mt-6">
          <h4 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            {lang === "ja" ? "添付ファイル" : "Attached Files"}
          </h4>

          {files.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-600 dark:bg-slate-700/30">
              <File className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? "このトピックにはファイルが添付されていません。"
                  : "No files attached to this topic."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => {
                const fileTypeLabel = getFileTypeLabel(file.file_type);

                return (
                  <div
                    key={file.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:shadow-slate-700/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5">
                          {getFileIcon(file.file_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {file.file_title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {file.file_name}
                            </span>
                            <span>•</span>
                            <span>{fileTypeLabel}</span>
                            {file.file_size && (
                              <>
                                <span>•</span>
                                <span>{formatFileSize(file.file_size)}</span>
                              </>
                            )}
                            {file.mime_type && (
                              <>
                                <span>•</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                  {file.mime_type}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {formatDate(file.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <HashIcon className="h-3 w-3" />
                              {lang === "ja" ? "並び順" : "Sort Order"}:{" "}
                              {file.sort_order}
                            </span>
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${
                                file.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                                  : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                              }`}
                            >
                              {file.status === "active"
                                ? lang === "ja"
                                  ? "有効"
                                  : "Active"
                                : lang === "ja"
                                  ? "無効"
                                  : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1.5 flex-shrink-0">
                        {file.view_url && (
                          <a
                            href={file.view_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {lang === "ja" ? "開く" : "View"}
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="cursor-pointer p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                        >
                          <Trash2 className="text-red-500 w-4 h-4 transition hover:text-red-400 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {lang === "ja" ? "閉じる" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
