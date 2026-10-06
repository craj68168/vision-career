"use client";

import axios from "axios";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ElementType,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from "react";

import { usePathname, useRouter } from "next/navigation";

import toast from "react-hot-toast";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

import {
  Briefcase,
  Building2,
  CalendarDays, 
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  Shield,
  UserCog,
  Users,
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

// ======================================================
// TYPES
// ======================================================

export interface TabConfig {
  id: string;
  label: {
    ja: string;
    en: string;
  };
  icon: ElementType;
  component: ReactNode;
  count?: number;
}

export interface TabGroup {
  label: {
    ja: string;
    en: string;
  };
  items: TabConfig[];
}

// ======================================================
// SHARED KEYBOARD FOCUS STYLES
// ======================================================

const focusRing = `
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-emerald-500
  focus-visible:ring-offset-2
  focus-visible:ring-offset-white
  dark:focus-visible:ring-offset-zinc-950
`;

export default function AdminPage() {
  const { lang } = useLanguage();

  const router = useRouter();
  const pathname = usePathname();

  // ======================================================
  // STATE
  // ======================================================

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("admin-theme") === "dark",
  );

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("admin-sidebar-collapsed") === "true",
  );

  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchActiveIndex, setSearchActiveIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // ======================================================
  // MOBILE SIDEBAR
  // ======================================================

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

  // ======================================================
  // DESKTOP BREAKPOINT
  // ======================================================

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    setIsDesktop(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);

      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleSidebar = () => {
    if (isDesktop) {
      const next = !isSidebarCollapsed;

      setIsSidebarCollapsed(next);

      localStorage.setItem("admin-sidebar-collapsed", String(next));

      return;
    }

    setIsMobileMenuOpen((previous) => !previous);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((previous) => {
      const next = !previous;
      localStorage.setItem("admin-theme", next ? "dark" : "light");
      return next;
    });
  };

  // ======================================================
  // AUTHENTICATION
  // ======================================================

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

  // ======================================================
  // LANGUAGE
  // ======================================================

  const handleLangChange = (targetLang: "en" | "ja") => {
    if (lang === targetLang) {
      return;
    }

    if (targetLang === "en") {
      if (pathname === "/en" || pathname.startsWith("/en/")) {
        return;
      }

      router.push(`/en${pathname}`);
      return;
    }

    const newPath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";

    router.push(newPath);
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("admin_token");

    router.replace(lang === "ja" ? "/admin-login" : "/en/admin-login");
  };

  // ======================================================
  // NAVIGATION
  // ======================================================

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

  // ======================================================
  // SEARCH
  // ======================================================

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return tabGroups.flatMap((group) =>
      group.items
        .filter((tab) =>
          [tab.label.ja, tab.label.en, group.label.ja, group.label.en].some(
            (text) => text.toLowerCase().includes(query),
          ),
        )
        .map((tab) => ({ tab, group })),
    );
  }, [searchQuery, tabGroups]);

  const showSearchResults = isSearchOpen && searchQuery.trim() !== "";

  const closeSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
    setSearchActiveIndex(0);
  };

  const handleSearchSelect = (tabId: string) => {
    handleTabChange(tabId);
    closeSearch();
    searchInputRef.current?.blur();
  };

  const handleSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    const total = searchResults.length;

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!showSearchResults) {
        setIsSearchOpen(true);
        return;
      }

      if (total > 0) {
        setSearchActiveIndex((previous) => (previous + 1) % total);
      }

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (total > 0) {
        setSearchActiveIndex((previous) => (previous - 1 + total) % total);
      }

      return;
    }

    if (event.key === "Enter") {
      const result = searchResults[searchActiveIndex];

      if (result) {
        event.preventDefault();
        handleSearchSelect(result.tab.id);
      }

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    }
  };

  // ======================================================
  // AUTHENTICATION LOADING
  // ======================================================

  if (isCheckingAuth) {
    return (
      <div
        className="
          flex min-h-dvh items-center justify-center
          bg-zinc-50 px-4
          text-zinc-950
        "
      >
        <div
          role="status"
          className="
            w-full max-w-sm
            rounded-lg border border-zinc-200
            bg-white px-5 py-6
            text-center shadow-sm

            sm:px-8 sm:py-7
          "
        >
          <Loader2
            className="
              mx-auto h-8 w-8
              animate-spin text-emerald-600

              sm:h-10 sm:w-10
            "
          />

          <p
            className="
              mt-4
              text-sm font-medium leading-relaxed
              text-zinc-600

              sm:text-base
            "
          >
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
      className={`
        min-h-dvh w-full min-w-0
        text-sm
        sm:text-base

        ${
          isDarkMode
            ? "dark bg-zinc-950 text-zinc-50"
            : "bg-zinc-50 text-zinc-950"
        }
      `}
    >
      {/* Main page layout */}
      <div
        className={`
          flex min-h-dvh min-w-0 flex-col

          transition-[padding] duration-200
          motion-reduce:transition-none

          ${
            isSidebarCollapsed
              ? `
                  lg:pl-0
                `
              : `
                  lg:pl-72
                `
          }
        `}
      >
        {/* Header */}
        <AdminHeader
          lang={lang}
          activeTabConfig={activeTabConfig}
          isDesktop={isDesktop}
          isSidebarCollapsed={isSidebarCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          focusRing={focusRing}
          isDarkMode={isDarkMode}
          toggleSidebar={toggleSidebar}
          toggleDarkMode={toggleDarkMode}
          getTabLabel={getTabLabel}
          handleLangChange={handleLangChange}
        />

        {/* Sidebar */}

        <AdminSidebar
          lang={lang}
          activeTab={activeTab}
          tabGroups={tabGroups}
          isMobileMenuOpen={isMobileMenuOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          focusRing={focusRing}
          getTabLabel={getTabLabel}
          getGroupLabel={getGroupLabel}
          handleTabChange={handleTabChange}
          handleLogout={handleLogout}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        {/* Active page content */}
        <main
          className="
            w-full min-w-0 flex-1
            px-3 py-4

            sm:px-6 sm:py-6

            lg:px-8
          "
        >
          <div
            key={activeTab}
            className="
              mx-auto w-full min-w-0
              max-w-[1440px]
            "
          >
            {activeTabComponent}
          </div>
        </main>

        {/* Footer */}
        <footer
          className="
            border-t border-zinc-200
            bg-white

            dark:border-zinc-800 dark:bg-zinc-950
          "
        >
          <div
            className="
              px-3 py-4
              text-center text-xs leading-relaxed
              text-zinc-500

              dark:text-zinc-400

              sm:px-6

              lg:px-8 lg:text-sm
            "
          >
            © {new Date().getFullYear()} Vision Career. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
