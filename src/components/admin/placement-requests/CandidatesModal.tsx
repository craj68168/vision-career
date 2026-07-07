import { Loader2, Pencil, RefreshCw, Search, Users, X } from "lucide-react";
import { CANDIDATE_STATUS_OPTIONS, formatDate } from "./placement-requests";

interface CandidatesModalProps {
  lang: "ja" | "en";
  setShowCandidatesModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPlacementRequest: any;
  setPlacementCandidates: React.Dispatch<React.SetStateAction<any[]>>;
  placementCandidatesSearch: string;
  setPlacementCandidatesSearch: React.Dispatch<React.SetStateAction<string>>;
  candidateStatusFilter: string;
  setCandidateStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  placementCandidatesPagination: any;
  setPlacementCandidatesPagination: React.Dispatch<React.SetStateAction<any>>;
  placementCandidates: any;
  loadingPlacementCandidates: boolean;
  fetchPlacementCandidates: any;
  placementCandidatesError: string;
  handleStatusUpdateClick: any;
  getCandidateStatusBadge: any;
  getCandidateStatusLabel: any;
}

export default function CandidatesModal({
  lang,
  setShowCandidatesModal,
  selectedPlacementRequest,
  setPlacementCandidates,
  placementCandidatesSearch,
  setPlacementCandidatesSearch,
  candidateStatusFilter,
  setCandidateStatusFilter,
  placementCandidatesPagination,
  setPlacementCandidatesPagination,
  placementCandidates,
  loadingPlacementCandidates,
  fetchPlacementCandidates,
  placementCandidatesError,
  handleStatusUpdateClick,
  getCandidateStatusBadge,
  getCandidateStatusLabel,
}: CandidatesModalProps) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowCandidatesModal(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/70 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800 dark:shadow-2xl dark:shadow-slate-950/30">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === "ja" ? "配置済み候補者一覧" : "Placed Candidates"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {selectedPlacementRequest.company_name} -{" "}
              {selectedPlacementRequest.job_title}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCandidatesModal(false);
              setPlacementCandidates([]);
            }}
            className="rounded-full p-2 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                value={placementCandidatesSearch}
                onChange={(e) => {
                  setPlacementCandidatesSearch(e.target.value);
                }}
                placeholder={
                  lang === "ja"
                    ? "候補者名、メール、企業名で検索..."
                    : "Search by candidate name, email, company..."
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-800"
              />
            </div>

            <select
              value={candidateStatusFilter}
              onChange={(e) => {
                setCandidateStatusFilter(e.target.value);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-600"
            >
              <option value="">
                {lang === "ja" ? "すべてのステータス" : "All Status"}
              </option>
              {CANDIDATE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[lang]}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (selectedPlacementRequest) {
                  fetchPlacementCandidates(selectedPlacementRequest.id, 1);
                }
              }}
              disabled={loadingPlacementCandidates}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              {loadingPlacementCandidates ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {lang === "ja" ? "更新" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="max-h-[55vh] overflow-y-auto px-6 py-4">
          {placementCandidatesError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {placementCandidatesError}
            </div>
          )}

          {loadingPlacementCandidates ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400 dark:text-slate-500" />
            </div>
          ) : placementCandidates.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? "このリクエストに配置された候補者はいません"
                  : "No candidates placed for this request"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">
                      {lang === "ja" ? "候補者" : "Candidate"}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {lang === "ja" ? "連絡先" : "Contact"}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {lang === "ja" ? "ステータス" : "Status"}
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      {lang === "ja" ? "追加日" : "Added"}
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      {lang === "ja" ? "操作" : "Actions"}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {placementCandidates.map((candidate: any, index: number) => (
                    <tr
                      key={candidate.placement_request_candidate_id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                        {(placementCandidatesPagination.page - 1) *
                          placementCandidatesPagination.limit +
                          index +
                          1}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {candidate.candidate_name || "-"}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {candidate.nationality || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="text-slate-700 dark:text-slate-300">
                            {candidate.candidate_email || "-"}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {candidate.candidate_phone || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getCandidateStatusBadge(candidate.candidate_status)}`}
                        >
                          {getCandidateStatusLabel(candidate.candidate_status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(lang, candidate.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleStatusUpdateClick(candidate)}
                            className="inline-flex items-center cursor-pointer gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                          >
                            <Pencil className="h-3 w-3" />
                            {lang === "ja" ? "ステータス更新" : "Update Status"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {placementCandidatesPagination.total > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {lang === "ja"
                  ? `全 ${placementCandidatesPagination.total} 件中 ${(placementCandidatesPagination.page - 1) * placementCandidatesPagination.limit + 1} - ${Math.min(placementCandidatesPagination.page * placementCandidatesPagination.limit, placementCandidatesPagination.total)} 件`
                  : `Showing ${(placementCandidatesPagination.page - 1) * placementCandidatesPagination.limit + 1} - ${Math.min(placementCandidatesPagination.page * placementCandidatesPagination.limit, placementCandidatesPagination.total)} of ${placementCandidatesPagination.total}`}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (selectedPlacementRequest) {
                      fetchPlacementCandidates(
                        selectedPlacementRequest.id,
                        placementCandidatesPagination.page - 1,
                      );
                    }
                  }}
                  disabled={
                    placementCandidatesPagination.page === 1 ||
                    loadingPlacementCandidates
                  }
                  className="rounded-xl border cursor-pointer border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {lang === "ja" ? "前へ" : "Prev"}
                </button>
                <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {placementCandidatesPagination.page} /{" "}
                  {placementCandidatesPagination.total_pages}
                </span>
                <button
                  onClick={() => {
                    if (selectedPlacementRequest) {
                      fetchPlacementCandidates(
                        selectedPlacementRequest.id,
                        placementCandidatesPagination.page + 1,
                      );
                    }
                  }}
                  disabled={
                    placementCandidatesPagination.page ===
                      placementCandidatesPagination.total_pages ||
                    loadingPlacementCandidates
                  }
                  className="rounded-xl border cursor-pointer border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {lang === "ja" ? "次へ" : "Next"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
