"use client";

import { RefreshCw, Search } from "lucide-react";

import { useApplications } from "./hook";

import ProviderApplicationCard from "./ProviderApplicationCard";

type Props = {
  lang: string;

  refreshVersion: number;
};

export default function Applications({ lang, refreshVersion }: Props) {
  const {
    loading,

    refreshing,

    search,

    setSearch,

    filteredApplications,

    refresh,
  } = useApplications({
    lang,

    refreshVersion,
  });

  return (
    <section className="mt-8">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              lang === "ja" ? "応募者を検索..." : "Search applications..."
            }
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400"
          />
        </div>

        <button
          type="button"
          disabled={refreshing}
          onClick={() => void refresh()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />

          {lang === "ja" ? "更新" : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
          {lang === "ja" ? "応募者を読み込み中..." : "Loading applications..."}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h3 className="text-xl font-semibold text-slate-900">
            {lang === "ja" ? "応募はまだありません" : "No applications yet"}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {lang === "ja"
              ? "管理者が応募を承認するとここに表示されます。"
              : "Applications approved by Admin will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <ProviderApplicationCard
              key={application.application_id}
              application={application}
              lang={lang}
            />
          ))}
        </div>
      )}
    </section>
  );
}
