"use client";

import { ChevronRight, Menu, Moon, Sun } from "lucide-react";

import type { TabConfig } from "./index";

interface AdminHeaderProps {
  lang: string;

  activeTabConfig: TabConfig;

  isDesktop: boolean;
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;

  focusRing: string;
  isDarkMode: boolean;

  toggleSidebar: () => void;
  toggleDarkMode: () => void;

  getTabLabel: (tab: TabConfig) => string;

  handleLangChange: (targetLang: "en" | "ja") => void;
}

export default function AdminHeader({
  lang,
  activeTabConfig,
  isDesktop,
  isSidebarCollapsed,
  isMobileMenuOpen,
  focusRing,
  isDarkMode,
  toggleSidebar,
  toggleDarkMode,
  getTabLabel,
  handleLangChange,
}: AdminHeaderProps) {
  const ActiveTabIcon = activeTabConfig.icon;

  return (
    <header
      className="
        sticky top-0 z-30
        border-b border-zinc-200
        bg-zinc-50/85 backdrop-blur-xl

        dark:border-zinc-800 dark:bg-zinc-950/85
      "
    >
          <div
            className="
              flex min-h-16 flex-wrap items-center
              gap-2 px-3 py-3

              sm:gap-3 sm:px-6

              lg:px-8
            "
          >
            {/* Sidebar toggle */}
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={
                lang === "ja" ? "サイドバーを切り替え" : "Toggle sidebar"
              }
              aria-expanded={isDesktop ? !isSidebarCollapsed : isMobileMenuOpen}
              aria-controls="admin-sidebar"
              className={`
                grid h-11 w-11 shrink-0 place-items-center
                cursor-pointer rounded-lg
                border border-zinc-200 bg-white
                text-zinc-700 transition

                hover:bg-zinc-100

                ${focusRing}
              `}
            >
              <Menu
                className="
                  h-4 w-4

                  sm:h-5 sm:w-5
                "
              />
            </button>

            {/* Active page title */}
            <div className="min-w-0 flex-1">
              <div
                className="
                  flex min-w-0 items-center
                  gap-1.5

                  sm:gap-2
                "
              >
                <ActiveTabIcon
                  className="
                    h-4 w-4 shrink-0
                    text-emerald-600

                    sm:h-5 sm:w-5
                  "
                />

                <h1
                  title={getTabLabel(activeTabConfig)}
                  className="
                    min-w-0 truncate
                    text-sm font-semibold

                    sm:text-base

                    lg:text-lg
                  "
                >
                  {getTabLabel(activeTabConfig)}
                </h1>

                <ChevronRight
                  className="
                    hidden h-4 w-4 shrink-0
                    text-zinc-400

                    md:block
                  "
                />

                <span
                  className="
                    hidden min-w-0 truncate
                    text-xs text-zinc-500

                    md:block

                    lg:text-sm
                  "
                >
                  {lang === "ja"
                    ? activeTabConfig.label.en
                    : activeTabConfig.label.ja}
                </span>
              </div>
            </div>

            {/* Theme control */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={
                lang === "ja"
                  ? isDarkMode
                    ? "ライトモードに切り替え"
                    : "ダークモードに切り替え"
                  : isDarkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
              }
              aria-pressed={isDarkMode}
              className={`
                grid h-11 w-11 shrink-0 place-items-center
                cursor-pointer rounded-lg
                border border-zinc-200 bg-white
                text-zinc-700 transition

                hover:bg-zinc-100

                dark:border-zinc-700 dark:bg-zinc-900
                dark:text-zinc-200 dark:hover:bg-zinc-800

                ${focusRing}
              `}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>

            {/* Language controls */}
            <div
              role="group"
              aria-label={lang === "ja" ? "言語" : "Language"}
              className="
                flex shrink-0 items-center
                rounded-lg border border-zinc-200
                bg-white p-1

                dark:border-zinc-700 dark:bg-zinc-900
              "
            >
              <button
                type="button"
                onClick={() => handleLangChange("ja")}
                aria-pressed={lang === "ja"}
                className={`
                  h-9 cursor-pointer
                  rounded-md px-2
                  text-xs font-semibold
                  transition

                  sm:px-3 sm:text-sm

                  ${focusRing}

                  ${
                    lang === "ja"
                      ? `
                          bg-zinc-950 text-white
                        `
                      : `
                          text-zinc-500

                          hover:bg-zinc-100

                          dark:text-zinc-400 dark:hover:bg-zinc-800
                        `
                  }
                `}
              >
                JA
              </button>

              <button
                type="button"
                onClick={() => handleLangChange("en")}
                aria-pressed={lang === "en"}
                className={`
                  h-9 cursor-pointer
                  rounded-md px-2
                  text-xs font-semibold
                  transition

                  sm:px-3 sm:text-sm

                  ${focusRing}

                  ${
                    lang === "en"
                      ? `
                          bg-zinc-950 text-white
                        `
                      : `
                          text-zinc-500

                          hover:bg-zinc-100

                          dark:text-zinc-400 dark:hover:bg-zinc-800
                        `
                  }
                `}
              >
                EN
              </button>
            </div>
          </div>
    </header>
  );
}