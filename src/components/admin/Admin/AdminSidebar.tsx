"use client";

import type { Dispatch, SetStateAction } from "react";

import { LogOut, X } from "lucide-react";

import type { TabConfig, TabGroup } from "./index";

interface AdminSidebarProps {
  lang: string;

  activeTab: string;
  tabGroups: TabGroup[];

  isMobileMenuOpen: boolean;
  isSidebarCollapsed: boolean;

  focusRing: string;

  getTabLabel: (tab: TabConfig) => string;
  getGroupLabel: (group: TabGroup) => string;

  handleTabChange: (tabId: string) => void;
  handleLogout: () => void;

  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AdminSidebar({
  lang,
  activeTab,
  tabGroups,
  isMobileMenuOpen,
  isSidebarCollapsed,
  focusRing,
  getTabLabel,
  getGroupLabel,
  handleTabChange,
  handleLogout,
  setIsMobileMenuOpen,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen ? (
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label={
            lang === "ja" ? "メニューを閉じる" : "Close navigation overlay"
          }
          className="
            fixed inset-0 z-40
            bg-zinc-950/50 backdrop-blur-sm

            lg:hidden
          "
        />
      ) : null}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-64 max-w-[85vw] flex-col
          border-r border-zinc-200
          bg-white px-3 py-4
          shadow-xl shadow-zinc-950/5

          transition-[transform,visibility] duration-200
          motion-reduce:transition-none

          sm:w-72

          lg:shadow-none

          ${
            isMobileMenuOpen
              ? `
                  translate-x-0
                `
              : `
                  -translate-x-full
                  max-lg:invisible
                `
          }

          ${
            isSidebarCollapsed
              ? `
                  lg:-translate-x-full
                  lg:invisible
                `
              : `
                  lg:translate-x-0
                  lg:visible
                `
          }
        `}
      >
        {/* Sidebar brand */}
        <div
          className="
            mb-4 flex shrink-0 items-center
            gap-2 px-1

            sm:mb-5 sm:gap-3 sm:px-2
          "
        >
          <button
            type="button"
            onClick={() => handleTabChange("dashboard")}
            aria-label={
              lang === "ja" ? "ダッシュボードへ移動" : "Go to dashboard"
            }
            className={`
              flex min-w-0 flex-1 items-center
              gap-2 cursor-pointer rounded-lg
              text-left

              sm:gap-3

              ${focusRing}
            `}
          >
            <div
              className="
                grid h-10 w-10 shrink-0 place-items-center
                rounded-lg bg-emerald-600
                text-sm font-bold text-white
              "
            >
              VC
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-sm font-semibold

                  sm:text-base
                "
              >
                Vision Career
              </p>

              <p
                className="
                  truncate
                  text-xs leading-relaxed text-zinc-500
                "
              >
                {lang === "ja"
                  ? "採用オペレーション"
                  : "Recruitment operations"}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label={lang === "ja" ? "メニューを閉じる" : "Close navigation"}
            className={`
              grid h-11 w-11 shrink-0 place-items-center
              cursor-pointer rounded-lg
              text-zinc-500 transition

              hover:bg-zinc-100 hover:text-zinc-950

              lg:hidden

              ${focusRing}
            `}
          >
            <X
              className="
                h-4 w-4

                sm:h-5 sm:w-5
              "
            />
          </button>
        </div>

        {/* Sidebar navigation */}
        <div
          className="
            min-h-0 flex-1
            space-y-4 overflow-y-auto overscroll-contain
            pr-1

            sm:space-y-5
          "
        >
          {tabGroups.map((group) => (
            <div key={group.label.en}>
              <p
                className="
                  mb-2 px-3
                  text-[11px] font-semibold uppercase
                  tracking-[0.16em] text-zinc-400

                  sm:text-xs
                "
              >
                {getGroupLabel(group)}
              </p>

              <nav
                aria-label={getGroupLabel(group)}
                className="
                  space-y-1
                "
              >
                {group.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`
                        flex min-h-11 w-full items-center
                        gap-3 rounded-lg px-3 py-2
                        cursor-pointer
                        text-left text-sm font-medium
                        transition

                        ${focusRing}

                        ${
                          isActive
                            ? `
                                bg-zinc-950 text-white
                                shadow-sm
                              `
                            : `
                                text-zinc-600

                                hover:bg-zinc-100 hover:text-zinc-950
                              `
                        }
                      `}
                    >
                      <Icon
                        className="
                          h-4 w-4 shrink-0

                          sm:h-5 sm:w-5
                        "
                      />

                      <span
                        className="
                          min-w-0 flex-1
                          break-words leading-snug
                        "
                      >
                        {getTabLabel(tab)}
                      </span>

                      {tab.count ? (
                        <span
                          className={`
                            shrink-0 rounded-full
                            px-2 py-0.5
                            text-[11px] font-semibold

                            ${
                              isActive
                                ? `
                                    bg-white/15 text-white
                                  `
                                : `
                                    bg-emerald-50 text-emerald-700
                                  `
                            }
                          `}
                        >
                          {tab.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Sidebar admin profile */}
        <div
          className="
            mt-4 shrink-0
            border-t border-zinc-200 pt-4
          "
        >
          <div
            className="
              flex items-center
              gap-2 rounded-lg bg-zinc-50 p-2

              sm:gap-3 sm:p-3
            "
          >
            <div
              className="
                grid h-9 w-9 shrink-0 place-items-center
                rounded-lg bg-sky-600
                text-xs font-bold text-white
              "
            >
              AD
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-sm font-semibold
                "
              >
                {lang === "ja" ? "管理者" : "Admin"}
              </p>

              <p
                className="
                  break-words
                  text-xs leading-relaxed text-zinc-500
                "
              >
                {lang === "ja" ? "オペレーション管理" : "Operations lead"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              aria-label={lang === "ja" ? "ログアウト" : "Logout"}
              className={`
                grid h-11 w-11 shrink-0 place-items-center
                cursor-pointer rounded-lg
                text-zinc-500 transition

                hover:bg-red-50 hover:text-red-600

                ${focusRing}
              `}
            >
              <LogOut
                className="
                  h-4 w-4

                  sm:h-5 sm:w-5
                "
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
