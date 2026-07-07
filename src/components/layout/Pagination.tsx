export default function Pagination({
  lang,
  pagination,
  limit,
  setLimit,
  setPage,
  pageControls,
  isFetching,
}: any) {
  return (
    <div className="flex flex-col gap-4 rounded-bl-2xl border-t border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600 dark:text-slate-400">
        {lang === "ja" ? (
          <>
            全 {pagination.totalItems} 件中{" "}
            {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalItems,
            )}{" "}
            件を表示
          </>
        ) : (
          <>
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalItems,
            )}{" "}
            of {pagination.totalItems}
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-600"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPage(1);
              pageControls.goToPage(1);
            }}
            disabled={!pagination.hasPreviousPage || isFetching}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {lang === "ja" ? "最初" : "First"}
          </button>

          <button
            onClick={pageControls.goToPreviousPage}
            disabled={!pagination.hasPreviousPage || isFetching}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {lang === "ja" ? "前へ" : "Prev"}
          </button>

          <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
            {pagination.currentPage} / {pagination.totalPages || 1}
          </span>

          <button
            onClick={pageControls.goToNextPage}
            disabled={!pagination.hasNextPage || isFetching}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {lang === "ja" ? "次へ" : "Next"}
          </button>

          <button
            onClick={() => {
              setPage(pagination.totalPages || 1);
              pageControls.goToPage(pagination.totalPages || 1);
            }}
            disabled={!pagination.hasNextPage || isFetching}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {lang === "ja" ? "最後" : "Last"}
          </button>
        </div>
      </div>
    </div>
  );
}
