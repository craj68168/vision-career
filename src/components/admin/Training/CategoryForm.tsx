"use client";
import { useTranslations } from "next-intl";
import type { TrainingStatus } from "./types";
interface CategoryFormProps {
  name: string; setName: (value: string) => void;
  description: string; setDescription: (value: string) => void;
  sortOrder: number; setSortOrder: (value: number) => void;
  status: TrainingStatus; setStatus: (value: TrainingStatus) => void;
  lang: string;
}
export function CategoryForm({ name, setName, description, setDescription, sortOrder, setSortOrder, status, setStatus }: CategoryFormProps) {
  const t = useTranslations("adminTraining");
  return (
    <div className="space-y-4">
      <div><label htmlFor="training-category-name" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("categoryNameRequiredLabel")}</label><input id="training-category-name" type="text" value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800" placeholder={t("categoryNamePlaceholder")} autoFocus /></div>
      <div><label htmlFor="training-category-description" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("descriptionLabel")}</label><textarea id="training-category-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800" placeholder={t("categoryDescriptionPlaceholder")} /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label htmlFor="training-category-sort" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("sortOrder")}</label><input id="training-category-sort" type="number" value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white" min="0" /></div>
        <div><label htmlFor="training-category-status" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{t("status")}</label><select id="training-category-status" value={status} onChange={(event) => setStatus(event.target.value as TrainingStatus)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"><option value="active">{t("active")}</option><option value="inactive">{t("inactive")}</option></select></div>
      </div>
    </div>
  );
}
