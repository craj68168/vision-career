"use client";

import Link from "next/link";

import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import {
  Bell,
  CalendarDays,
  CheckCheck,
  Clock3,
  ExternalLink,
  Loader2,
  LogOut,
  Video,
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
  SeekerNotificationInterview,
} from "@/components/job-seekers/Dashboard/types";

// ======================================================
// DESIGN TOKENS (same as job seeker dashboard)
// - primary emerald-700 (hover 800), soft emerald-50
// - text emerald-950, muted slate-600
// - weights: headings semibold, labels/body medium or normal
// - density: 40px controls, 16px card padding
// ======================================================

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

const container = "mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10";

const iconButtonBase = `relative inline-flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-md border text-[13px] font-medium transition active:translate-y-px ${focusRing}`;
const iconButtonIdle =
  "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-emerald-700";
const iconButtonActive = "border-emerald-200 bg-emerald-50 text-emerald-700";

const wrap = "[overflow-wrap:anywhere]";

const LANGUAGES = [
  { code: "ja", label: "JA", flag: "🇯🇵" },
  { code: "en", label: "EN", flag: "🇺🇸" },
] as const;

function getIsSeeker() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem("user_role") === "seeker";
}

// ======================================================
// COMPONENT
// ======================================================

const Navbar = () => {
  const router = useRouter();

  const pathname = usePathname();

  const { lang } = useLanguage();

  const [scrolled, setScrolled] = useState(false);

  const [seeker, setSeeker] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<SeekerNotification[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement | null>(null);

  const bellRef = useRef<HTMLButtonElement | null>(null);

  // ====================================================
  // SEEKER CHECK (client only, avoids hydration mismatch)
  // ====================================================

  useEffect(() => {
    setSeeker(getIsSeeker());
  }, [pathname]);

  // ====================================================
  // LOAD NOTIFICATIONS
  // ====================================================

  const loadNotifications = useCallback(async () => {
    if (!getIsSeeker()) {
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
  // INITIAL LOAD + POLLING
  // ====================================================

  useEffect(() => {
    if (!seeker) {
      setNotifications([]);

      setUnreadCount(0);

      return;
    }

    void loadNotifications();

    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [seeker, loadNotifications]);

  // ====================================================
  // SCROLL
  // ====================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ====================================================
  // CLOSE DROPDOWN ON PATH CHANGE
  // ====================================================

  useEffect(() => {
    setNotificationsOpen(false);
  }, [pathname]);

  // ====================================================
  // CLOSE DROPDOWN: OUTSIDE CLICK + ESCAPE
  // ====================================================

  useEffect(() => {
    if (!notificationsOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);

        bellRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notificationsOpen]);

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

    setSeeker(false);

    setNotificationsOpen(false);

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
  // LABELS
  // ====================================================

  const notificationsLabel = lang === "ja" ? "通知" : "Notifications";

  const bellLabel =
    unreadCount > 0
      ? lang === "ja"
        ? `通知(未読${unreadCount}件)`
        : `Notifications, ${unreadCount} unread`
      : notificationsLabel;

  // ====================================================
  // UI
  // ====================================================

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-slate-200 text-emerald-950 transition-[background-color,box-shadow] duration-300 ${
        scrolled ? "bg-white/85 shadow-sm backdrop-blur-md" : "bg-white"
      }`}
    >
      <div className={container}>
        <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
          {/* LOGO */}

          <Link
            href={lang === "ja" ? "/job-seekers" : "/en/job-seekers"}
            className={`group inline-flex min-w-0 items-center gap-2.5 rounded-md ${focusRing}`}
          >
            <span
              aria-hidden
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-emerald-700 text-sm font-semibold text-white transition group-hover:bg-emerald-800"
            >
              V
            </span>

            <span className="hidden truncate text-lg font-semibold tracking-tight min-[380px]:inline">
              Vacancify
            </span>
          </Link>

          {/* ACTIONS */}

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            {/* SEEKER NOTIFICATIONS */}

            {seeker && (
              <div ref={notificationRef} className="relative">
                <button
                  ref={bellRef}
                  type="button"
                  onClick={() => void toggleNotifications()}
                  className={`${iconButtonBase} w-10 ${
                    notificationsOpen ? iconButtonActive : iconButtonIdle
                  }`}
                  aria-label={bellLabel}
                  aria-haspopup="dialog"
                  aria-expanded={notificationsOpen}
                  aria-controls="seeker-notifications"
                >
                  <Bell className="h-4 w-4" />

                  {unreadCount > 0 && (
                    <span
                      aria-hidden
                      className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-700 px-1 text-[10px] font-medium tabular-nums text-white ring-2 ring-white"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* DROPDOWN: full-width sheet on phones, anchored card from sm up */}

                <div
                  id="seeker-notifications"
                  role="dialog"
                  aria-label={notificationsLabel}
                  aria-hidden={!notificationsOpen}
                  className={`fixed inset-x-3 top-[3.75rem] z-[100] origin-top-right overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg transition-[opacity,transform,visibility] duration-150 motion-reduce:transition-none sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[26rem] ${
                    notificationsOpen
                      ? "visible translate-y-0 scale-100 opacity-100"
                      : "invisible -translate-y-1 scale-95 opacity-0"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold">
                        {notificationsLabel}
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-600">
                        {unreadCount > 0
                          ? lang === "ja"
                            ? `${unreadCount}件の未読通知`
                            : `${unreadCount} unread`
                          : lang === "ja"
                            ? "未読通知はありません"
                            : "You're all caught up"}
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => void handleMarkAllRead()}
                        className={`inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-900 ${focusRing}`}
                      >
                        <CheckCheck className="h-4 w-4" />

                        {lang === "ja" ? "すべて既読" : "Mark all read"}
                      </button>
                    )}
                  </div>

                  <div className="max-h-[min(70dvh,30rem)] overflow-y-auto overscroll-contain">
                    {loadingNotifications && notifications.length === 0 ? (
                      <div
                        className="flex min-h-40 items-center justify-center"
                        role="status"
                        aria-busy="true"
                        aria-label={lang === "ja" ? "読み込み中" : "Loading"}
                      >
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-700 motion-reduce:animate-none" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-6 py-10 text-center">
                        <span
                          aria-hidden
                          className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-700"
                        >
                          <Bell className="h-4 w-4" />
                        </span>

                        <p className="mt-3 text-[13px] font-medium text-slate-700">
                          {lang === "ja" ? "通知はありません" : "No notifications"}
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
              </div>
            )}

            {/* LANGUAGE */}

            <div
              role="group"
              aria-label={lang === "ja" ? "言語" : "Language"}
              className="inline-flex h-10 items-center rounded-md border border-slate-200 bg-slate-100 p-0.5"
            >
              {LANGUAGES.map(({ code, label, flag }) => {
                const active = lang === code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleLangChange(code)}
                    aria-pressed={active}
                    lang={code}
                    className={`inline-flex h-full cursor-pointer items-center gap-1 rounded-[5px] px-2 text-[11px] font-medium transition sm:px-2.5 ${focusRing} ${
                      active
                        ? "bg-white text-emerald-950 shadow-sm"
                        : "text-slate-500 hover:text-emerald-950"
                    }`}
                  >
                    {label}

                    <span aria-hidden className="hidden sm:inline">
                      {flag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className={`${iconButtonBase} ${iconButtonIdle} w-10 sm:w-auto sm:gap-2 sm:px-3`}
              aria-label={lang === "ja" ? "ログアウト" : "Logout"}
            >
              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">
                {lang === "ja" ? "ログアウト" : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
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
  const t = useTranslations("jobSeeker.notifications");
  const title = formatNotificationTitle(notification, t);
  const message = formatNotificationMessage(notification, t, lang);

  return (
    <div
      className={`border-b border-slate-100 px-4 py-3 transition last:border-b-0 ${
        notification.isRead
          ? "bg-white hover:bg-slate-50"
          : "bg-emerald-50/60 hover:bg-emerald-50"
      }`}
    >
      <button
        type="button"
        onClick={() => void onRead(notification)}
        className={`w-full rounded-md text-left ${
          notification.isRead ? "cursor-default" : "cursor-pointer"
        } ${focusRing}`}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${
              notification.isRead
                ? "bg-slate-100 text-slate-500"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            <Video className="h-4 w-4" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className={`text-[13px] font-semibold ${wrap}`}>
                {title}
              </p>

              {!notification.isRead && (
                <span
                  role="img"
                  aria-label={lang === "ja" ? "未読" : "Unread"}
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-700"
                />
              )}
            </div>

            <p className={`mt-0.5 text-xs leading-5 text-slate-600 ${wrap}`}>
              {message}
            </p>

            <p className="mt-1.5 text-[11px] text-slate-500">
              {formatNotificationDate(notification.createdAt, lang)}
            </p>
          </div>
        </div>
      </button>

      {interview && (
        <div className="ml-11 mt-2.5 rounded-md border border-slate-200 bg-white p-3">
          {interview.jobTitle && (
            <p className={`text-xs font-semibold ${wrap}`}>
              {interview.jobTitle}
            </p>
          )}

          {/* {interview.companyName && (
            <p className={`mt-0.5 text-xs text-slate-600 ${wrap}`}>
              {interview.companyName}
            </p>
          )} */}

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
            {interview.interviewDate && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays
                  aria-hidden
                  className="h-3 w-3 shrink-0 text-slate-400"
                />

                {formatNotificationDate(interview.interviewDate, lang, false)}
              </span>
            )}

            {interview.interviewTime && (
              <span className="inline-flex items-center gap-1">
                <Clock3
                  aria-hidden
                  className="h-3 w-3 shrink-0 text-slate-400"
                />

                {interview.interviewTime}

                {interview.timezone ? ` (${interview.timezone})` : ""}
              </span>
            )}
          </div>

          {interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-emerald-800 active:translate-y-px ${focusRing}`}
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

function formatNotificationDate(
  value?: string | null,
  lang?: string,
  withTime = true,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",

    month: "short",

    day: "numeric",

    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function formatNotificationTitle(
  notification: SeekerNotification,
  t: ReturnType<typeof useTranslations>,
) {
  const titleKeys = {
    INTERVIEW_SCHEDULED: "titles.INTERVIEW_SCHEDULED",
    INTERVIEW_CONFIRMED: "titles.INTERVIEW_CONFIRMED",
    INTERVIEW_UPDATED: "titles.INTERVIEW_UPDATED",
    INTERVIEW_CANCELLED: "titles.INTERVIEW_CANCELLED",
  } as const;

  return t(titleKeys[notification.type]) || notification.title;
}

function formatNotificationMessage(
  notification: SeekerNotification,
  t: ReturnType<typeof useTranslations>,
  lang: string,
) {
  const messageKeys = {
    INTERVIEW_SCHEDULED: "messages.INTERVIEW_SCHEDULED",
    INTERVIEW_CONFIRMED: "messages.INTERVIEW_CONFIRMED",
    INTERVIEW_UPDATED: "messages.INTERVIEW_UPDATED",
    INTERVIEW_CANCELLED: "messages.INTERVIEW_CANCELLED",
  } as const;

  const interview = notification.interview;
  const jobTitle = interview?.jobTitle?.trim();

  if (!interview || !jobTitle) {
    return formatLegacyNotificationMessage(notification);
  }

  return t(messageKeys[notification.type], {
    jobTitle,
    date: formatNotificationDate(interview.interviewDate, lang, false),
    time: interview.interviewTime || "",
    timezone: interview.timezone || "",
    method: formatNotificationMethod(interview.interviewMethod, t),
  });
}

function formatNotificationMethod(
  method: SeekerNotificationInterview["interviewMethod"],
  t: ReturnType<typeof useTranslations>,
) {
  const methodKeys = {
    ZOOM: "methods.ZOOM",
    GOOGLE_MEET: "methods.GOOGLE_MEET",
    PHONE: "methods.PHONE",
    FACE_TO_FACE: "methods.FACE_TO_FACE",
    OTHER: "methods.OTHER",
  } as const;

  if (!method || !(method in methodKeys)) {
    return t("methods.OTHER");
  }

  return t(methodKeys[method as keyof typeof methodKeys]);
}

function formatLegacyNotificationMessage(notification: SeekerNotification) {
  const companyName = notification.interview?.companyName?.trim();
  const jobTitle = notification.interview?.jobTitle?.trim();

  if (!companyName) {
    return notification.message;
  }

  let message = notification.message;

  if (jobTitle) {
    message = message.replace(
      `for ${jobTitle} at ${companyName}`,
      `for ${jobTitle}`,
    );
  }

  return message
    .replace(` at ${companyName} has`, " has")
    .replace(` at ${companyName} is`, " is")
    .replace(` at ${companyName}.`, ".");
}

export default Navbar;
