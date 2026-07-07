import { Building2, CalendarDays, Eye, MapPin, Wallet } from "lucide-react";
import { formatSalary, formatDate } from "./DetailsModal";

export default function Vacancies({
  filteredVacancies,
  lang,
  handleViewDetails,
  handleEditVacancy,
  handleDeleteDialog,
}: any) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {filteredVacancies.map((vacancy: any) => (
        <div
          key={vacancy.id}
          className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {lang === "ja"
                  ? `求人 #${vacancy.id}`
                  : `Vacancy #${vacancy.id}`}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">
                {vacancy.title}
              </h3>
            </div>

            <button
              onClick={() => handleViewDetails(vacancy.id)}
              className="rounded-full p-2 cursor-pointer text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span>
                {vacancy.company_name ||
                  (lang === "ja" ? "不明な企業" : "Unknown company")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>
                {vacancy.work_location ||
                  (lang === "ja" ? "場所未設定" : "Location not set")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Wallet className="h-4 w-4 text-slate-400" />
              <span>
                {formatSalary(vacancy.salary_min, vacancy.salary_max)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <span>
                {lang === "ja" ? "掲載日" : "Posted on"}{" "}
                {formatDate(vacancy.created_at)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={() => handleEditVacancy(vacancy.id)}
              className="rounded-xl border cursor-pointer border-slate-200 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              {lang === "ja" ? "編集" : "Edit Vacancy"}
            </button>
            <button
              onClick={() => handleDeleteDialog(vacancy.id)}
              className="rounded-xl cursor-pointer bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
            >
              {lang === "ja" ? "削除" : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
