"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import AdminApplicationsPage from "@/components/admin/applications/applications";
import AllVacanciesList from "@/components/admin/vacancies/vacancies";
import {
  Loader2,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Briefcase,
  FileText,
  Building2,
  Users,
  ClipboardList,
  CreditCard,
  UserCog,
  GraduationCap,
  ChevronDown,
  Sun,
  Moon,
  Shield,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import AdminProvidersList from "./job-providers/job-providers";
import AdminJobSeekersList from "./job-seekers/job-seekers";
import AdminPlacementRequestsPage from "./placement-requests/placement-requests";
import toast from "react-hot-toast";
import AdminPlacementBillingsPage from "./placement-billings/placement-billings";
import AdminStaffList from "./staffs";
import AdminTrainingCategories from "./training/training";
import AdminDashboard from "./dashboard/body";
import AdminUpdateCredentialsPage from "./security";

interface TabConfig {
  id: string;
  label: { ja: string; en: string };
  icon: React.ElementType;
  component: React.ReactNode;
}

export default function AdminPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("admin-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("admin-theme", "light");
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace(lang === "ja" ? "/admin-login" : "/en/admin-login");
        return;
      }

      const res = await fetch("https://vision-career.co.jp/admin_profile.php", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok && res.status === 200) {
        setIsAllowed(true);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Error while checking auth",
      );
      setIsAllowed(false);
      router.replace(lang === "ja" ? "/admin-login" : "/en/admin-login");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLangChange = (targetLang: "en" | "ja") => {
    if (lang === targetLang) return;

    if (targetLang === "en") {
      router.push(`/en${pathname}`);
    } else {
      const newPath = pathname.replace(/^\/en/, "") || "/";
      router.push(newPath);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin-theme");
    router.replace(lang === "ja" ? "/admin-login" : "/en/admin-login");
  };

  // Tab definitions
  const tabs: TabConfig[] = [
    {
      id: "dashboard",
      label: { ja: "ダッシュボード", en: "Dashboard" },
      icon: LayoutDashboard,
      component: <AdminDashboard setActiveDashboardTab={setActiveTab} />,
    },
    {
      id: "vacancies",
      label: { ja: "求人", en: "Vacancies" },
      icon: Briefcase,
      component: <AllVacanciesList />,
    },
    {
      id: "applications",
      label: { ja: "応募", en: "Applications" },
      icon: FileText,
      component: <AdminApplicationsPage />,
    },
    {
      id: "providers",
      label: { ja: "クライアント", en: "Clients" },
      icon: Building2,
      component: <AdminProvidersList />,
    },
    {
      id: "seekers",
      label: { ja: "求職者", en: "Job Seekers" },
      icon: Users,
      component: <AdminJobSeekersList />,
    },
    {
      id: "placement-requests",
      label: { ja: "採用依頼", en: "Placement Requests" },
      icon: ClipboardList,
      component: <AdminPlacementRequestsPage />,
    },
    {
      id: "placement-billings",
      label: { ja: "採用請求", en: "Placement Billings" },
      icon: CreditCard,
      component: <AdminPlacementBillingsPage />,
    },
    {
      id: "staffs",
      label: { ja: "スタッフ", en: "Staff" },
      icon: UserCog,
      component: <AdminStaffList />,
    },
    {
      id: "training",
      label: { ja: "スタッフ訓練", en: "Staff Training" },
      icon: GraduationCap,
      component: <AdminTrainingCategories />,
    },
    {
      id: "security",
      label: { ja: "セキュリティ", en: "Security" },
      icon: Shield,
      component: <AdminUpdateCredentialsPage />,
    },
  ];

  const getTabLabel = (tab: TabConfig) => {
    return lang === "ja" ? tab.label.ja : tab.label.en;
  };

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

  if (!isAllowed) {
    return null;
  }

  return (
    <div className="flex w-full flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top Navigation Bar */}
      <header className="w-full sticky top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
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

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                <button
                  onClick={() => handleLangChange("ja")}
                  className={`rounded-md cursor-pointer px-2.5 py-1 text-xs font-medium transition ${
                    lang === "ja"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  JA
                </button>
                <button
                  onClick={() => handleLangChange("en")}
                  className={`rounded-md cursor-pointer px-2.5 py-1 text-xs font-medium transition ${
                    lang === "en"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 cursor-pointer text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              <button
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

      {/* Navigation Tabs */}
      <nav className="w-full sticky top-16 z-40 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:flex lg:items-center lg:gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm font-medium transition whitespace-nowrap ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {getTabLabel(tab)}
                </button>
              );
            })}
          </div>

          <div className="relative lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <span className="flex items-center gap-2">
                {(() => {
                  const activeTabConfig = tabs.find((t) => t.id === activeTab);
                  if (activeTabConfig) {
                    const Icon = activeTabConfig.icon;
                    return (
                      <>
                        <Icon className="h-4 w-4" />
                        {getTabLabel(activeTabConfig)}
                      </>
                    );
                  }
                  return null;
                })()}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMobileMenuOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {getTabLabel(tab)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full mx-auto flex-1 py-6">
        <div className="transition-all duration-200">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Vision Career. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
