"use client";

import type { ComponentType, ReactNode } from "react";

import {
  BookOpen,
  CalendarDays,
  ExternalLink,
  File,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  GraduationCap,
  Image,
  Presentation,
  Video,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

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
// TRANSLATIONS
// ======================================================

const translations = {
  ja: {
    close: "閉じる",
    trainingTopic: "研修トピック",
    description: "説明",
    category: "カテゴリー",
    files: "ファイル",
    updated: "更新日",
    trainingMaterials: "研修教材",
    noFiles: "このトピックには研修ファイルが添付されていません。",
    open: "開く",
  },
  en: {
    close: "Close",
    trainingTopic: "Training Topic",
    description: "Description",
    category: "Category",
    files: "Files",
    updated: "Updated",
    trainingMaterials: "Training Materials",
    noFiles: "No training files are attached to this topic.",
    open: "Open",
  },
};

// ======================================================
// SHARED CLASSES
//
// Outlines use `ring` (a shadow) instead of `border`, so
// they are not affected by global border-color rules.
// ======================================================

const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

// ======================================================
// COMPONENT
// ======================================================

export default function TopicDetailsModal({
  topic,
  onClose,
  onOpenFile,
}: Props) {
  const { lang } = useLanguage();

  const t = translations[lang === "ja" ? "ja" : "en"];

  if (!topic) return null;

  const files = topic.files ?? [];

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      {/* BACKDROP */}

      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label={t.close}
      />

      {/* MODAL */}

      <div
        role="dialog"
        aria-modal="true"
        aria-label={topic.title}
        className="relative z-10 flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 sm:max-h-[92dvh] sm:rounded-2xl"
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(120deg,#eef2ff_0%,#f5f3ff_45%,#ffffff_100%)] px-4 py-4 shadow-[inset_0_-1px_0_0_#e0e7ff] sm:px-6 sm:py-5">
          {/* decorative grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.07)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:linear-gradient(90deg,#000,transparent)]"
          />

          <div className="relative flex items-start gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white shadow-md shadow-indigo-600/30"
            >
              <GraduationCap className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                {t.trainingTopic}
              </p>

              <h2 className="mt-0.5 break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                {topic.title}
              </h2>

              <p className="mt-1 break-words text-xs text-slate-500">
                {topic.categoryName || topic.categoryId}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              title={t.close}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/60">
          <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {/* DESCRIPTION */}

            {topic.description && (
              <Section
                icon={FileText}
                title={t.description}
                accent="violet"
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                  {topic.description}
                </p>
              </Section>
            )}

            {/* INFO */}

            <div className="grid gap-3 sm:grid-cols-3">
              <InfoBox
                icon={<FolderOpen className="h-3.5 w-3.5" />}
                label={t.category}
                value={topic.categoryName || topic.categoryId}
              />

              <InfoBox
                icon={<FileText className="h-3.5 w-3.5" />}
                label={t.files}
                value={String(topic.filesCount)}
              />

              <InfoBox
                icon={<CalendarDays className="h-3.5 w-3.5" />}
                label={t.updated}
                value={formatStaffTrainingDate(topic.updatedAt, lang)}
              />
            </div>

            {/* FILES */}

            <Section
              icon={BookOpen}
              title={t.trainingMaterials}
              accent="indigo"
            >
              {files.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-8 text-center ring-1 ring-inset ring-slate-200/70">
                  <File
                    aria-hidden="true"
                    className="mx-auto h-8 w-8 text-slate-300"
                  />

                  <p className="mt-3 text-sm text-slate-500">{t.noFiles}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.fileId}
                      className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200/70 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white ring-1 ring-inset ring-slate-200"
                        >
                          <FileTypeIcon type={file.fileType} />
                        </span>

                        <div className="min-w-0">
                          <p className="break-words font-semibold text-slate-950">
                            {file.fileTitle}
                          </p>

                          <p className="mt-0.5 truncate text-sm text-slate-500">
                            {file.fileName}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                            <span>
                              {getStaffTrainingFileTypeLabel(
                                file.fileType,
                                lang,
                              )}
                            </span>

                            <span className="tabular-nums">
                              {formatStaffTrainingFileSize(file.fileSize)}
                            </span>

                            <span>
                              {formatStaffTrainingDate(file.createdAt, lang)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenFile(file)}
                        className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:w-auto"
                      >
                        <ExternalLink className="h-4 w-4" />

                        {t.open}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex shrink-0 flex-col-reverse gap-2 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[inset_0_1px_0_0_#e2e8f0] sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className={secondaryButton}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// SECTION
//
// Full class names are written out so Tailwind can
// detect them.
// ======================================================

const sectionAccents = {
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
} as const;

function Section({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: ComponentType<{ className?: string }>;

  title: string;

  accent: keyof typeof sectionAccents;

  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200 sm:p-5">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset ${sectionAccents[accent]}`}
        >
          <Icon className="h-4 w-4" />
        </span>

        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      </div>

      <div className="mt-4">{children}</div>
    </section>
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
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-white p-3.5 ring-1 ring-inset ring-slate-200">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <span aria-hidden="true" className="text-slate-400">
          {icon}
        </span>

        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// FILE TYPE ICON
// ======================================================

function FileTypeIcon({ type }: { type: StaffTrainingFile["fileType"] }) {
  switch (type) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "video":
      return <Video className="h-5 w-5 text-purple-500" />;
    case "image":
      return <Image className="h-5 w-5 text-blue-500" />;
    case "excel":
      return <FileSpreadsheet className="h-5 w-5 text-emerald-600" />;
    case "ppt":
      return <Presentation className="h-5 w-5 text-orange-500" />;
    case "doc":
      return <FileText className="h-5 w-5 text-blue-600" />;
    default:
      return <File className="h-5 w-5 text-slate-500" />;
  }
}