import { X } from "lucide-react";
import VacancyForm from "@/components/uploadVacancy";

export default function AddVacancyModal({
  setShowAddModal,
  lang,
  user,
  fetchVacancies,
}: any) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => setShowAddModal(false)}
        aria-hidden="true"
      />
      <div className="relative z-10 max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {lang === "ja" ? "求人を追加" : "Add Vacancy"}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(false)}
            className="rounded-full p-2 text-slate-500 cursor-pointer transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <VacancyForm
            userId={user.id}
            onSuccess={() => {
              setShowAddModal(false);
              fetchVacancies();
            }}
          />
        </div>
      </div>
    </div>
  );
}
