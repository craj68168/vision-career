import { Loader2, X } from "lucide-react";
import { ErrorPanel } from "./DetailsModal";
import VacancyForm from "@/components/uploadVacancy";
export default function EditVacancyModal({
  closeEditModal,
  lang,
  editingVacancy,
  loadingEdit,
  editError,
  user,
  toFormInitialData,
  fetchVacancies,
}: any) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={closeEditModal}
        aria-hidden="true"
      />
      <div className="relative z-10 max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {lang === "ja" ? "求人を編集" : "Edit Vacancy"}
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              {editingVacancy?.title ||
                (lang === "ja" ? "求人を読み込み中..." : "Loading vacancy...")}
            </h3>
          </div>
          <button
            onClick={closeEditModal}
            className="rounded-full p-2 text-slate-500 cursor-pointer transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {loadingEdit ? (
            <div className="py-16 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
              <p className="mt-4 text-sm text-slate-600">
                {lang === "ja"
                  ? "編集用の求人を読み込み中..."
                  : "Loading vacancy for editing..."}
              </p>
            </div>
          ) : editError ? (
            <ErrorPanel
              title={
                lang === "ja"
                  ? "求人を読み込めません"
                  : "Unable to load vacancy"
              }
              message={editError}
            />
          ) : editingVacancy ? (
            <VacancyForm
              userId={user.id}
              mode="edit"
              vacancyId={editingVacancy.id}
              initialData={toFormInitialData(editingVacancy)}
              onSuccess={async () => {
                closeEditModal();
                await fetchVacancies();
              }}
            />
          ) : (
            <div className="py-16 text-center text-sm text-slate-500">
              {lang === "ja"
                ? "編集する求人データはありません。"
                : "No vacancy data available for editing."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
