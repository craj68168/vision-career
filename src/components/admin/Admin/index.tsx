"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Briefcase,
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Moon,
  Search,
  Shield,
  Sun,
  UserCog,
  Users,
  X,
} from "lucide-react";

import { getCurrentAdmin } from "@/components/auth/Admin/api";
import type { AdminApiErrorResponse } from "@/components/auth/Admin/types";
import { useLanguage } from "@/context/LanguageContext";

import AdminApplicationsPage from "@/components/admin/Applications";
import AdminInterviewsPage from "@/components/admin/Interviews";
import AllVacanciesList from "@/components/admin/Vacancies";
import AdminDashboard from "../Dashboard";
import AdminProvidersList from "../JobProviders";
import AdminJobSeekersList from "../JobSeekers";
import AdminPlacementBillingsPage from "../PlacementBillings";
import AdminPlacementRequestsPage from "../PlacementRequests";
import AdminUpdateCredentialsPage from "../Security";
import AdminStaffList from "../Staffs";
import AdminTrainingCategories from "../Training";

interface TabConfig {
  id: string;
  label: {
    ja: string;
    en: string;
  };
  icon: ElementType;
  component: ReactNode;
  count?: number;
}

interface TabGroup {
  label: {
    ja: string;
    en: string;
  };
  items: TabConfig[];
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900";

export default function AdminPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("admin-theme") === "dark",
  );
  const [isAllowed, setIsAllowed] = useState(false);

  // Desktop sidebar collapse (remembered across reloads).
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("admin-sidebar-collapsed") === "true",
  );

  // Tracks the lg breakpoint so one button can drive both behaviors.
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Mobile drawer: close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Track the desktop breakpoint and reset the drawer when it grows to desktop.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);

      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((previous) => {
      const next = !previous;

      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("admin-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("admin-theme", "light");
      }

      return next;
    });
  };

  // Desktop: collapse / expand the sidebar. Mobile: open / close the drawer.
  const toggleSidebar = () => {
    if (isDesktop) {
      const next = !isSidebarCollapsed;
      setIsSidebarCollapsed(next);
      localStorage.setItem("admin-sidebar-collapsed", String(next));
      return;
    }

    setIsMobileMenuOpen((previous) => !previous);
  };

  useEffect(() => {
    let active = true;

    const checkAdminAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("user_role");

        if (!token || role !== "admin") {
          router.replace(lang === "ja" ? "/admin-login" : "/en/admin-login");
          return;
        }

        await getCurrentAdmin();

        if (!active) {
          return;
        }

        setIsAllowed(true);
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        console.error("Admin auth error:", error);
        setIsAllowed(false);

        if (axios.isAxiosError<AdminApiErrorResponse>(error)) {
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_role");
            router.replace(lang === "ja" ? "/admin-login" : "/en/admin-login");
            return;
          }

          toast.error(
            error.response?.data?.message ||
              "Error while checking authentication.",
          );
          return;
        }

        toast.error("Error while checking authentication.");
      } finally {
        if (active) {
          setIsCheckingAuth(false);
        }
      }
    };

    void checkAdminAuth();

    return () => {
      active = false;
    };
  }, [lang, router]);

  const handleLangChange = (targetLang: "en" | "ja") => {
    if (lang === targetLang) {
      return;
    }

    if (targetLang === "en") {
      if (pathname.startsWith("/en/")) {
        return;
      }

      router.push(`/en${pathname}`);
      return;
    }

    const newPath = pathname.replace(/^\/en/, "") || "/";
    router.push(newPath);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin-theme");

    document.documentElement.classList.remove("dark");
    router.replace(lang === "ja" ? "/admin-login" : "/en/admin-login");
  };

  const tabGroups = useMemo<TabGroup[]>(
    () => [
      {
        label: {
          ja: "採用管理",
          en: "Recruitment",
        },
        items: [
          {
            id: "dashboard",
            label: {
              ja: "ダッシュボード",
              en: "Dashboard",
            },
            icon: LayoutDashboard,
            component: <AdminDashboard setActiveDashboardTab={setActiveTab} />,
          },
          {
            id: "vacancies",
            label: {
              ja: "求人",
              en: "Vacancies",
            },
            icon: Briefcase,
            component: <AllVacanciesList />,
          },
          {
            id: "applications",
            label: {
              ja: "応募",
              en: "Applications",
            },
            icon: FileText,
            component: <AdminApplicationsPage />,
          },
          {
            id: "interviews",
            label: {
              ja: "面接",
              en: "Interviews",
            },
            icon: CalendarDays,
            component: <AdminInterviewsPage />,
          },
          {
            id: "providers",
            label: {
              ja: "クライアント",
              en: "Clients",
            },
            icon: Building2,
            component: <AdminProvidersList />,
          },
        ],
      },
      {
        label: {
          ja: "人材",
          en: "Talent",
        },
        items: [
          {
            id: "seekers",
            label: {
              ja: "求職者",
              en: "Job Seekers",
            },
            icon: Users,
            component: <AdminJobSeekersList />,
          },
          {
            id: "placement-requests",
            label: {
              ja: "採用依頼",
              en: "Placement Requests",
            },
            icon: ClipboardList,
            component: <AdminPlacementRequestsPage />,
          },
          {
            id: "placement-billings",
            label: {
              ja: "採用請求",
              en: "Placement Billings",
            },
            icon: CreditCard,
            component: <AdminPlacementBillingsPage />,
          },
        ],
      },
      {
        label: {
          ja: "チーム",
          en: "Team",
        },
        items: [
          {
            id: "staffs",
            label: {
              ja: "スタッフ",
              en: "Staff",
            },
            icon: UserCog,
            component: <AdminStaffList />,
          },
          {
            id: "training",
            label: {
              ja: "スタッフ研修",
              en: "Staff Training",
            },
            icon: GraduationCap,
            component: <AdminTrainingCategories />,
          },
          {
            id: "security",
            label: {
              ja: "セキュリティ",
              en: "Security",
            },
            icon: Shield,
            component: <AdminUpdateCredentialsPage />,
          },
        ],
      },
    ],
    [],
  );

  const tabs = tabGroups.flatMap((group) => group.items);
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const ActiveTabIcon = activeTabConfig.icon;
  const activeTabComponent = activeTabConfig.component;

  const getTabLabel = (tab: TabConfig) => {
    return lang === "ja" ? tab.label.ja : tab.label.en;
  };

  const getGroupLabel = (group: TabGroup) => {
    return lang === "ja" ? group.label.ja : group.label.en;
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 text-zinc-950 dark:bg-zinc-950 dark:text-white">
        <div
          role="status"
          className="rounded-lg border border-zinc-200 bg-white px-8 py-7 text-center shadow-sm dark:border-white/10 dark:bg-zinc-900"
        >
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400" />
          <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {lang === "ja" ? "認証を確認中..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return (
    <div
      translate="no"
      className="min-h-screen w-full bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-white"
    >
      {isMobileMenuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
      ) : null}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white px-3 py-4 shadow-xl shadow-zinc-950/5 transition-[transform,visibility] duration-200 motion-reduce:transition-none dark:border-white/10 dark:bg-zinc-900 lg:shadow-none ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full max-lg:invisible"
        } ${
          isSidebarCollapsed
            ? "lg:-translate-x-full lg:invisible"
            : "lg:translate-x-0"
        }`}
      >
        <div className="mb-5 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
            VC
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Vision Career</p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {lang === "ja" ? "採用オペレーション" : "Recruitment operations"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden ${focusRing}`}
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain pr-1">
          {tabGroups.map((group) => (
            <div key={group.label.en}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                {getGroupLabel(group)}
              </p>
              <nav className="space-y-1" aria-label={getGroupLabel(group)}>
                {group.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition ${focusRing} ${
                        isActive
                          ? "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">
                        {getTabLabel(tab)}
                      </span>
                      {tab.count ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            isActive
                              ? "bg-white/15 text-white dark:bg-zinc-950/10 dark:text-zinc-950"
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                          }`}
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

        <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-white/10">
          <div className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-white/5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-600 text-xs font-bold text-white">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {lang === "ja" ? "管理者" : "Admin"}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {lang === "ja" ? "オペレーション管理" : "Operations lead"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-500 transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-300 ${focusRing}`}
              aria-label={lang === "ja" ? "ログアウト" : "Logout"}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div
        className={`flex min-h-screen min-w-0 flex-col transition-[padding] duration-200 motion-reduce:transition-none ${
          isSidebarCollapsed ? "lg:pl-0" : "lg:pl-72"
        }`}
      >
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-zinc-50/85 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80">
          <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={toggleSidebar}
              className={`grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
              aria-label={
                lang === "ja" ? "サイドバーを切り替え" : "Toggle sidebar"
              }
              aria-expanded={isDesktop ? !isSidebarCollapsed : isMobileMenuOpen}
              aria-controls="admin-sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <ActiveTabIcon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <h1 className="truncate text-base font-semibold">
                  {getTabLabel(activeTabConfig)}
                </h1>
                <ChevronRight className="hidden h-4 w-4 shrink-0 text-zinc-400 sm:block" />
                <span className="hidden truncate text-sm text-zinc-500 dark:text-zinc-400 sm:block">
                  {lang === "ja"
                    ? activeTabConfig.label.en
                    : activeTabConfig.label.ja}
                </span>
              </div>
            </div>

            <label className="hidden h-10 w-48 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-500 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 md:flex lg:w-64">
              <Search className="h-4 w-4 shrink-0" />
              <input
                aria-label={lang === "ja" ? "管理画面を検索" : "Search admin"}
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
                placeholder={lang === "ja" ? "管理画面を検索" : "Search admin"}
              />
            </label>

            <div
              className="flex shrink-0 items-center rounded-lg border border-zinc-200 bg-white p-1 dark:border-white/10 dark:bg-white/5"
              role="group"
              aria-label="Language"
            >
              <button
                type="button"
                onClick={() => handleLangChange("ja")}
                aria-pressed={lang === "ja"}
                className={`h-8 cursor-pointer rounded-md px-2.5 text-xs font-semibold transition sm:px-3 ${focusRing} ${
                  lang === "ja"
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10"
                }`}
              >
                JA
              </button>
              <button
                type="button"
                onClick={() => handleLangChange("en")}
                aria-pressed={lang === "en"}
                className={`h-8 cursor-pointer rounded-md px-2.5 text-xs font-semibold transition sm:px-3 ${focusRing} ${
                  lang === "en"
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10"
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 ${focusRing}`}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </header>

        <main className="w-full min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div key={activeTab} className="mx-auto w-full min-w-0 max-w-[1440px]">
            {activeTabComponent}
          </div>
        </main>

        <footer className="border-t border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
          <div className="px-4 py-4 text-center text-xs text-zinc-500 dark:text-zinc-400 sm:px-6 lg:px-8">
            © {new Date().getFullYear()} Vision Career. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}