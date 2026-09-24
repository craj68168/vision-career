"use client";

import Link from "next/link";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  Bell,
  CheckCheck,
  ExternalLink,
  Loader2,
  LogOut,
  Video,
  X,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import axios from "axios";

import { useLanguage } from "@/context/LanguageContext";

import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/components/job-seekers/Dashboard/api";

import type {
  ApiErrorResponse,
  SeekerNotification,
} from "@/components/job-seekers/Dashboard/types";

// ======================================================
// LINKS
// ======================================================

const links = [
  {
    label: "Home",
    href: "/",
  },

  {
    label: "How It Works",
    href: "/how-it-works/",
  },

  {
    label: "Pricing",
    href: "/pricing/",
  },

  {
    label: "Why Us",
    href: "/why-us/",
  },

  {
    label: "Book a Call",
    href: "/book-call/",
  },

  {
    label: "Get Started",
    href: "/get-started/",
  },
];

// ======================================================
// COMPONENT
// ======================================================

const Navbar = () => {
  const router = useRouter();

  const pathname = usePathname();

  const { lang } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<SeekerNotification[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement | null>(null);

  // ====================================================
  // SEEKER CHECK
  // ====================================================

  const isSeeker = () => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem("user_role") === "seeker";
  };

  // ====================================================
  // LOAD NOTIFICATIONS
  // ====================================================

  const loadNotifications = useCallback(async () => {
    if (!isSeeker()) {
      setNotifications([]);

      setUnreadCount(0);

      return;
    }

    try {
      setLoadingNotifications(true);

      const response = await getMyNotifications(1, 20, false);

      setNotifications(Array.isArray(response.data) ? response.data : []);

      setUnreadCount(response.unreadCount || 0);
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          return;
        }
      }

      console.error("Notification load error:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  // ====================================================
  // INITIAL NOTIFICATION LOAD
  // ====================================================

  useEffect(() => {
    void loadNotifications();

    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadNotifications]);

  // ====================================================
  // SCROLL
  // ====================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ====================================================
  // CLOSE MENU ON PATH CHANGE
  // ====================================================

  useEffect(() => {
    setIsMenuOpen(false);

    setNotificationsOpen(false);
  }, [pathname]);

  // ====================================================
  // BODY OVERFLOW
  // ====================================================

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // ====================================================
  // CLOSE NOTIFICATION DROPDOWN
  // ====================================================

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // ====================================================
  // LANGUAGE
  // ====================================================

  const handleLangChange = (targetLang: "en" | "ja") => {
    if (lang === targetLang) {
      return;
    }

    if (targetLang === "en") {
      const currentPath = pathname.startsWith("/en")
        ? pathname
        : `/en${pathname === "/" ? "" : pathname}`;

      router.push(currentPath || "/en");

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

    setNotifications([]);

    setUnreadCount(0);

    if (pathname.includes("job-seekers")) {
      router.push(lang === "ja" ? "/job-seekers-auth" : "/en/job-seekers-auth");

      return;
    }

    if (pathname.includes("staff")) {
      router.push(lang === "ja" ? "/staff-login" : "/en/staff-login");

      return;
    }

    if (pathname.includes("admin")) {
      router.push(lang === "ja" ? "/admin-login" : "/en/admin-login");

      return;
    }

    router.push(lang === "ja" ? "/auth" : "/en/auth");
  };

  // ====================================================
  // OPEN NOTIFICATIONS
  // ====================================================

  const toggleNotifications = async () => {
    const next = !notificationsOpen;

    setNotificationsOpen(next);

    if (next) {
      await loadNotifications();
    }
  };

  // ====================================================
  // MARK ONE READ
  // ====================================================

  const handleNotificationClick = async (notification: SeekerNotification) => {
    if (notification.isRead) {
      return;
    }

    try {
      await markNotificationRead(notification.notificationId);

      setNotifications((current) =>
        current.map((item) =>
          item.notificationId === notification.notificationId
            ? {
                ...item,

                isRead: true,

                readAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      setUnreadCount((current) => Math.max(current - 1, 0));
    } catch (error) {
      console.error("Mark notification read error:", error);
    }
  };

  // ====================================================
  // MARK ALL READ
  // ====================================================

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      await markAllNotificationsRead();

      const now = new Date().toISOString();

      setNotifications((current) =>
        current.map((item) => ({
          ...item,

          isRead: true,

          readAt: item.readAt || now,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b border-gray-200 ${
          scrolled
            ? "bg-white/80 text-slate-600 backdrop-blur-2xl"
            : "bg-white text-black"
        } transition-all duration-500`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO */}

            <Link
              href={lang === "ja" ? "/" : "/en"}
              className="flex items-center gap-2 font-bold uppercase tracking-wider"
            >
              Vacancify
            </Link>

            {/* ACTIONS */}

            <div className="flex items-center gap-3">
              {/* SEEKER NOTIFICATIONS */}

              {typeof window !== "undefined" && isSeeker() && (
                <div ref={notificationRef} className="relative">
                  <button
                    type="button"
                    onClick={() => void toggleNotifications()}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* DROPDOWN */}

                  {notificationsOpen && (
                    <div className="absolute right-0 top-12 z-[100] w-[min(92vw,420px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                          <h3 className="font-semibold text-slate-950">
                            {lang === "ja" ? "通知" : "Notifications"}
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {unreadCount > 0
                              ? lang === "ja"
                                ? `${unreadCount}件の未読通知`
                                : `${unreadCount} unread`
                              : lang === "ja"
                                ? "未読通知はありません"
                                : "No unread notifications"}
                          </p>
                        </div>

                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={() => void handleMarkAllRead()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            <CheckCheck className="h-4 w-4" />

                            {lang === "ja" ? "すべて既読" : "Mark all read"}
                          </button>
                        )}
                      </div>

                      <div className="max-h-[480px] overflow-y-auto">
                        {loadingNotifications && notifications.length === 0 ? (
                          <div className="flex min-h-40 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="px-6 py-10 text-center">
                            <Bell className="mx-auto h-8 w-8 text-slate-300" />

                            <p className="mt-3 text-sm font-medium text-slate-700">
                              {lang === "ja"
                                ? "通知はありません"
                                : "No notifications"}
                            </p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <NotificationItem
                              key={notification.notificationId}
                              notification={notification}
                              lang={lang}
                              onRead={handleNotificationClick}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LANGUAGE */}

              <button
                type="button"
                onClick={() => handleLangChange(lang === "ja" ? "en" : "ja")}
                className={`relative flex h-8 w-[90px] cursor-pointer items-center rounded-full p-1 transition-colors duration-300 hover:bg-gray-200 ${
                  scrolled ? "bg-gray-200" : "bg-gray-100"
                }`}
              >
                <div
                  className={`absolute left-1 top-1 h-6 w-[42px] rounded-full bg-white shadow-sm transition-transform ${
                    lang === "ja" ? "" : "translate-x-10"
                  }`}
                />

                <div className="relative z-10 flex w-full justify-between px-2 text-[10px] font-semibold">
                  <span
                    className={
                      lang === "ja" ? "text-neutral-900" : "text-neutral-500"
                    }
                  >
                    JA 🇯🇵
                  </span>

                  <span
                    className={
                      lang === "en" ? "text-neutral-900" : "text-neutral-500"
                    }
                  >
                    EN 🇺🇸
                  </span>
                </div>
              </button>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE BACKDROP */}

      <div
        className={`fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* MOBILE PANEL */}

      <div
        className={`fixed bottom-0 right-0 top-0 z-70 h-full w-70 bg-white shadow-2xl transition-transform duration-300 ease-out xl:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-50 p-6">
            <span className="font-bold text-slate-900">Menu</span>

            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full p-2 transition-colors hover:bg-slate-100"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-xl p-3 text-lg font-medium transition-all ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-50 p-6">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);

                router.push("/book-call");
              }}
              className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg transition-transform active:scale-[0.98]"
            >
              Book a free call
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ======================================================
// NOTIFICATION ITEM
// ======================================================

function NotificationItem({
  notification,
  lang,
  onRead,
}: {
  notification: SeekerNotification;

  lang: string;

  onRead: (notification: SeekerNotification) => void | Promise<void>;
}) {
  const interview = notification.interview;

  return (
    <div
      className={`border-b border-slate-100 px-5 py-4 transition last:border-b-0 ${
        notification.isRead ? "bg-white" : "bg-blue-50/60"
      }`}
    >
      <button
        type="button"
        onClick={() => void onRead(notification)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 rounded-xl p-2 ${
              notification.isRead
                ? "bg-slate-100 text-slate-500"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            <Video className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">
                {notification.title}
              </p>

              {!notification.isRead && (
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              )}
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              {notification.message}
            </p>

            <p className="mt-2 text-[11px] text-slate-400">
              {formatNotificationDate(notification.createdAt)}
            </p>
          </div>
        </div>
      </button>

      {interview && (
        <div className="ml-11 mt-3 rounded-xl bg-slate-50 p-3">
          {interview.jobTitle && (
            <p className="text-xs font-semibold text-slate-900">
              {interview.jobTitle}
            </p>
          )}

          {interview.companyName && (
            <p className="mt-1 text-xs text-slate-500">
              {interview.companyName}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
            {interview.interviewDate && (
              <span>{formatNotificationDate(interview.interviewDate)}</span>
            )}

            {interview.interviewTime && <span>{interview.interviewTime}</span>}

            {interview.timezone && <span>{interview.timezone}</span>}
          </div>

          {interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {lang === "ja" ? "面接リンクを開く" : "Open Interview Link"}

              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ======================================================
// DATE
// ======================================================

function formatNotificationDate(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",

    month: "short",

    day: "numeric",

    hour: "2-digit",

    minute: "2-digit",
  }).format(date);
}

export default Navbar;
