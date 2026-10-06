"use client";
import { useTranslations } from "next-intl";
import type { TrainingStatus } from "./types";
interface TopicFormProps {
  categoryName: string; title: string; setTitle: (value: string) => void;
  description: string; setDescription: (value: string) => void;
  sortOrder: number; setSortOrder: (value: number) => void;
  status: TrainingStatus; setStatus: (value: TrainingStatus) => void;
  lang: string; isEdit?: boolean;
}
export function TopicForm({ categoryName, title, setTitle, description, setDescription, sortOrder, setSortOrder, status, setStatus }: TopicFormProps) {
  const t = useTranslations("adminTraining");
  return (
    <div className="space-y-4">
      <div><label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("category")}</label><div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">{categoryName}</div></div>
      <div><label htmlFor="training-topic-title" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("topicTitleRequiredLabel")}</label><input id="training-topic-title" type="text" value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder={t("topicTitlePlaceholder")} autoFocus /></div>
      <div><label htmlFor="training-topic-description" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("descriptionLabel")}</label><textarea id="training-topic-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder={t("topicDescriptionPlaceholder")} /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label htmlFor="training-topic-sort" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("sortOrder")}</label><input id="training-topic-sort" type="number" value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white" min="0" /></div>
        <div><label htmlFor="training-topic-status" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("status")}</label><select id="training-topic-status" value={status} onChange={(event) => setStatus(event.target.value as TrainingStatus)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"><option value="active">{t("active")}</option><option value="inactive">{t("inactive")}</option></select></div>
      </div>
    </div>
  );
}
