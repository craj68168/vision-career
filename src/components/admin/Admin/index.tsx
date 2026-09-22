"use client";

import axios from "axios";

import { useEffect, useMemo, useState } from "react";

import type { ElementType, ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";

import toast from "react-hot-toast";

import {
  Briefcase,
  Building2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  Moon,
  Shield,
  ShieldCheck,
  Sun,
  UserCog,
  Users,
} from "lucide-react";

import { getCurrentAdmin } from "@/components/auth/Admin/api";

import type { AdminApiErrorResponse } from "@/components/auth/Admin/types";

import { useLanguage } from "@/context/LanguageContext";

import AdminApplicationsPage from "@/components/admin/Applications";

import AllVacanciesList from "@/components/admin/Vacancies";

import AdminProvidersList from "../JobProviders";

import AdminJobSeekersList from "../JobSeekers";

import AdminPlacementRequestsPage from "../PlacementRequests";

import AdminPlacementBillingsPage from "../PlacementBillings";

import AdminStaffList from "../Staffs";

import AdminTrainingCategories from "../Training";

import AdminDashboard from "../Dashboard";

import AdminUpdateCredentialsPage from "../Security";

// ======================================================
// TYPES
// ======================================================

interface TabConfig {
  id: string;

  label: {
    ja: string;
    en: string;
  };

  icon: ElementType;

  component: ReactNode;
}

// ======================================================
// ADMIN PAGE
// ======================================================

export default function AdminPage() {
  const { lang } = useLanguage();

  const router = useRouter();

  const pathname = usePathname();

  // ====================================================
  // STATE
  // ====================================================

  const [activeTab, setActiveTab] = useState("dashboard");

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isAllowed, setIsAllowed] = useState(false);

  // ====================================================
  // THEME
  // ====================================================

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");

    if (savedTheme === "dark") {
      setIsDarkMode(true);

      document.documentElement.classList.add("dark");
    }
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

  // ====================================================
  // ADMIN AUTH CHECK
  // ====================================================

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

  // ====================================================
  // LANGUAGE
  // ====================================================

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

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    localStorage.removeItem("user_role");

    // Old PHP token cleanup
    localStorage.removeItem("admin_token");

    localStorage.removeItem("admin-theme");

    document.documentElement.classList.remove("dark");

    router.replace(lang === "ja" ? "/admin-login" : "/en/admin-login");
  };

  // ====================================================
  // TAB DEFINITIONS
  // ====================================================

  const tabs = useMemo<TabConfig[]>(
    () => [
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
        id: "providers",

        label: {
          ja: "クライアント",
          en: "Clients",
        },

        icon: Building2,

        component: <AdminProvidersList />,
      },

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
          ja: "スタッフ訓練",
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
    [],
  );

  // ====================================================
  // ACTIVE TAB
  // ====================================================

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  const ActiveTabIcon = activeTabConfig.icon;

  const activeTabComponent = activeTabConfig.component;

  // ====================================================
  // TAB LABEL
  // ====================================================

  const getTabLabel = (tab: TabConfig) => {
    return lang === "ja" ? tab.label.ja : tab.label.en;
  };

  // ====================================================
  // TAB CHANGE
  // ====================================================

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    setIsMobileMenuOpen(false);
  };

  // ====================================================
  // AUTH LOADING
  // ====================================================

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />

          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            {lang === "ja" ? "認証を確認中..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // NOT ALLOWED
  // ====================================================

  if (!isAllowed) {
    return null;
  }

  // ====================================================
  // UI
  //
  // translate="no" is intentional.
  //
  // Browser translation extensions can modify React's
  // DOM tree and cause insertBefore/removeChild errors.
  //
  // The application already has its own EN / JA system.
  // ====================================================

  return (
    <div
      translate="no"
      className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900"
    >
      {/* ==================================================
          TOP NAVIGATION
      ================================================== */}

      <header className="sticky left-0 right-0 top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* BRAND */}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>

                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {lang === "ja" ? "管理パネル" : "Admin Panel"}
                </span>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex items-center gap-2">
              {/* LANGUAGE */}

              <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => handleLangChange("ja")}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    lang === "ja"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>JA</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLangChange("en")}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    lang === "en"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>EN</span>
                </button>
              </div>

              {/* THEME */}

              <button
                type="button"
                onClick={toggleTheme}
                className="cursor-pointer rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
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

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />

                <span className="hidden sm:inline">
                  {lang === "ja" ? "ログアウト" : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================
          NAVIGATION TABS
      ================================================== */}

      <nav className="sticky top-16 z-40 w-full border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ================================================
              DESKTOP
          ================================================ */}

          <div className="hidden items-center gap-1 overflow-x-auto py-2 lg:flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </span>

                  <span>{getTabLabel(tab)}</span>
                </button>
              );
            })}
          </div>

          {/* ================================================
              MOBILE
          ================================================ */}

          <div className="relative lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((previous) => !previous)}
              className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="flex items-center gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  <ActiveTabIcon className="h-4 w-4" />
                </span>

                <span>{getTabLabel(activeTabConfig)}</span>
              </span>

              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileMenuOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                        <Icon className="h-4 w-4" />
                      </span>

                      <span>{getTabLabel(tab)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="mx-auto w-full flex-1 py-6">
        <div key={activeTab} className="transition-all duration-200">
          {activeTabComponent}
        </div>
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Vision Career. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
