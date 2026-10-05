"use client";

import type {
  Dispatch,
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
  SetStateAction,
} from "react";

import { ChevronRight, Menu, Search } from "lucide-react";

import type { TabConfig, TabGroup } from "./index";

interface AdminHeaderProps {
  lang: string;

  activeTabConfig: TabConfig;

  isDesktop: boolean;
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;

  focusRing: string;

  searchQuery: string;
  searchActiveIndex: number;
  showSearchResults: boolean;

  searchResults: {
    tab: TabConfig;
    group: TabGroup;
  }[];

  searchInputRef: RefObject<HTMLInputElement | null>;

  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSearchActiveIndex: Dispatch<SetStateAction<number>>;
  setIsSearchOpen: Dispatch<SetStateAction<boolean>>;

  toggleSidebar: () => void;

  getTabLabel: (tab: TabConfig) => string;
  getGroupLabel: (group: TabGroup) => string;

  handleLangChange: (targetLang: "en" | "ja") => void;
  handleSearchSelect: (tabId: string) => void;

  handleSearchKeyDown: (
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => void;
}

export default function AdminHeader({
  lang,
  activeTabConfig,
  isDesktop,
  isSidebarCollapsed,
  isMobileMenuOpen,
  focusRing,
  searchQuery,
  searchActiveIndex,
  showSearchResults,
  searchResults,
  searchInputRef,
  setSearchQuery,
  setSearchActiveIndex,
  setIsSearchOpen,
  toggleSidebar,
  getTabLabel,
  getGroupLabel,
  handleLangChange,
  handleSearchSelect,
  handleSearchKeyDown,
}: AdminHeaderProps) {
  const ActiveTabIcon = activeTabConfig.icon;

  return (
    <>
      {/* Paste the complete header JSX here. */}
              <header
          className="
            sticky top-0 z-30
            border-b border-zinc-200
            bg-zinc-50/85 backdrop-blur-xl
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

            {/* Search: full row below xl, inline from xl */}
            <div
              className="
                relative order-last w-full

                xl:order-none xl:w-64 xl:shrink-0
              "
            >
              <label
                className="
                  flex h-11 w-full items-center
                  gap-2 rounded-lg
                  border border-zinc-200 bg-white
                  px-3 text-zinc-500

                  focus-within:border-emerald-500
                  focus-within:ring-2
                  focus-within:ring-emerald-500/20
                "
              >
                <Search
                  className="
                    h-4 w-4 shrink-0

                    sm:h-5 sm:w-5
                  "
                />

                <input
                  ref={searchInputRef}
                  type="search"
                  role="combobox"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchActiveIndex(0);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setIsSearchOpen(false)}
                  onKeyDown={handleSearchKeyDown}
                  aria-label={lang === "ja" ? "管理画面を検索" : "Search admin"}
                  aria-expanded={showSearchResults}
                  aria-controls="admin-search-results"
                  aria-autocomplete="list"
                  aria-activedescendant={
                    showSearchResults && searchResults[searchActiveIndex]
                      ? `admin-search-option-${searchResults[searchActiveIndex].tab.id}`
                      : undefined
                  }
                  placeholder={lang === "ja" ? "管理画面を検索" : "Search admin"}
                  className="
                    min-w-0 flex-1
                    bg-transparent
                    text-base text-zinc-900
                    outline-none
                    placeholder:text-zinc-400
                  "
                />
              </label>

              {showSearchResults ? (
                <ul
                  id="admin-search-results"
                  role="listbox"
                  className="
                    absolute inset-x-0 top-full z-50 mt-2
                    max-h-72 overflow-y-auto overscroll-contain
                    rounded-lg border border-zinc-200
                    bg-white p-1
                    shadow-xl shadow-zinc-950/5
                  "
                >
                  {searchResults.length === 0 ? (
                    <li
                      role="presentation"
                      className="
                        px-3 py-3
                        text-sm text-zinc-500
                      "
                    >
                      {lang === "ja" ? "該当なし" : "No results"}
                    </li>
                  ) : (
                    searchResults.map(({ tab, group }, index) => {
                      const Icon = tab.icon;

                      return (
                        <li
                          key={tab.id}
                          id={`admin-search-option-${tab.id}`}
                          role="option"
                          aria-selected={index === searchActiveIndex}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSearchSelect(tab.id)}
                          onMouseEnter={() => setSearchActiveIndex(index)}
                          className={`
                            flex min-h-11 w-full items-center
                            gap-3 rounded-md px-3 py-2
                            cursor-pointer
                            text-left text-sm

                            ${
                              index === searchActiveIndex
                                ? `
                                    bg-zinc-100 text-zinc-950
                                  `
                                : `
                                    text-zinc-600
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
                              truncate font-medium
                            "
                          >
                            {getTabLabel(tab)}
                          </span>

                          <span
                            className="
                              shrink-0
                              text-xs text-zinc-400
                            "
                          >
                            {getGroupLabel(group)}
                          </span>
                        </li>
                      );
                    })
                  )}
                </ul>
              ) : null}
            </div>

            {/* Language controls */}
            <div
              role="group"
              aria-label={lang === "ja" ? "言語" : "Language"}
              className="
                flex shrink-0 items-center
                rounded-lg border border-zinc-200
                bg-white p-1
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
                        `
                  }
                `}
              >
                EN
              </button>
            </div>
          </div>
        </header>
    </>
  );
}