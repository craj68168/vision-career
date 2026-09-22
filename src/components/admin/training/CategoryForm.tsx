"use client";

import type { TrainingStatus } from "./types";

interface CategoryFormProps {
  name: string;

  setName: (value: string) => void;

  description: string;

  setDescription: (value: string) => void;

  sortOrder: number;

  setSortOrder: (value: number) => void;

  status: TrainingStatus;

  setStatus: (value: TrainingStatus) => void;

  lang: string;
}

export function CategoryForm({
  name,
  setName,
  description,
  setDescription,
  sortOrder,
  setSortOrder,
  status,
  setStatus,
  lang,
}: CategoryFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {lang === "ja" ? "カテゴリー名 *" : "Category Name *"}
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600 dark:focus:bg-slate-800"
          placeholder={
            lang === "ja" ? "カテゴリー名を入力" : "Enter category name"
          }
          autoFocus
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {lang === "ja" ? "説明" : "Description"}
        </label>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
          placeholder={
            lang === "ja"
              ? "カテゴリーの説明を入力（任意）"
              : "Enter category description (optional)"
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {lang === "ja" ? "並び順" : "Sort Order"}
          </label>

          <input
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            min="0"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {lang === "ja" ? "ステータス" : "Status"}
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TrainingStatus)
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="active">{lang === "ja" ? "有効" : "Active"}</option>

            <option value="inactive">
              {lang === "ja" ? "無効" : "Inactive"}
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
