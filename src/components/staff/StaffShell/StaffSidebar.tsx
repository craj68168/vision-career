"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { ComponentType } from "react";
import {
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserRoundSearch,
  Users,
  X,
} from "lucide-react";

import type { StaffPermission, StaffUser } from "@/components/auth/Staff/types";

type IconType = ComponentType<{ className?: string }>;

type MenuItem = {
  label: string;
  href: string;
  icon: IconType;
  permission?: StaffPermission;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/staff", icon: LayoutDashboard }],
  },
  {
    label: "Recruitment",
    items: [
      {
        label: "Vacancies",
        permission: "vacancies:view",
        href: "/staff/vacancies",
        icon: BriefcaseBusiness,
      },
      {
        label: "Applications",
        permission: "applications:view",
        href: "/staff/applications",
        icon: FileText,
      },
      {
        label: "Clients",
        permission: "providers:view",
        href: "/staff/clients",
        icon: Building2,
      },
      {
        label: "Job Seekers",
        permission: "seekers:view",
        href: "/staff/job-seekers",
        icon: Users,
      },
    ],
  },
  {
    label: "Placements",
    items: [
      {
        label: "Placement Requests",
        permission: "placement_requests:view",
        href: "/staff/placement-requests",
        icon: ClipboardCheck,
      },
      {
        label: "Placement Candidates",
        permission: "placement_requests:manage_candidates",
        href: "/staff/placement-candidates",
        icon: UserRoundSearch,
      },
      {
        label: "Placement Billings",
        permission: "billing:view",
        href: "/staff/placement-billings",
        icon: CreditCard,
      },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Staff Training", href: "/staff/training", icon: GraduationCap },
      { label: "Security", href: "/staff/security", icon: ShieldCheck },
    ],
  },
];

type StaffSidebarProps = {
  staff: StaffUser;
  prefix: string;
  pathname: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
};

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S"
  );
}

export default function StaffSidebar({
  staff,
  prefix,
  pathname,
  collapsed,
  mobileOpen,
  onCloseMobile,
  onLogout,
}: StaffSidebarProps) {
  const visibleGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.permission || staff.permissions.includes(item.permission),
      ),
    }))
    .filter((group) => group.items.length > 0);

  const isMenuActive = (href: string) => {
    const fullHref = `${prefix}${href}`;

    if (href === "/staff") {
      return pathname === fullHref || pathname === `${fullHref}/`;
    }

    return pathname.startsWith(fullHref);
  };

  // Mobile drawer: close with Escape and lock page scroll while open.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseMobile();
    };

    // If the screen grows to desktop width while the drawer is open
    // (rotating a tablet, resizing a window), close it so the page
    // scroll lock is released.
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) onCloseMobile();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    desktopQuery.addEventListener("change", onDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktopQuery.removeEventListener("change", onDesktop);
    };
  }, [mobileOpen, onCloseMobile]);

  // ====================================================
  // CLASS HELPERS
  // ====================================================

  const linkBase =
    "group relative flex h-11 w-full items-center gap-2.5 rounded-lg px-2 text-[14px] font outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 lg:h-10 [@media(max-height:640px)]:h-[38px]";

  const linkClass = (active: boolean) =>
    [
      linkBase,
      collapsed ? "justify-center px-0" : "",
      active
        ? `bg-indigo-50 font-medium text-indigo-700 hover:bg-indigo-100/70 before:absolute before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r before:bg-indigo-600 before:content-[''] ${
            collapsed ? "before:-left-3" : "before:-left-[13px]"
          }`
        : "text-slate-600 hover:bg-indigo-50 hover:text-slate-950",
    ]
      .filter(Boolean)
      .join(" ");

  const chipClass = (active: boolean) =>
    `grid h-7 w-7 shrink-0 place-items-center rounded-md transition-colors ${
      active
        ? "bg-indigo-600 text-white"
        : "text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
    }`;

  return (
    <aside
      aria-label="Staff sidebar"
      className={[
        // frame
        "flex h-[100dvh] shrink-0 flex-col border-r border-slate-200 bg-white",
        "transition-[width,transform,visibility] duration-200 ease-out motion-reduce:transition-none",

        // mobile / tablet: slide-in drawer
        "fixed left-0 top-0 z-40 w-[min(86vw,300px)] shadow-2xl",
        mobileOpen
          ? "visible translate-x-0"
          : "invisible -translate-x-full",

        // desktop: sticky column
        "lg:visible lg:sticky lg:z-auto lg:translate-x-0 lg:shadow-none",
        collapsed ? "lg:w-[72px]" : "lg:w-[248px] xl:w-[280px]",
      ].join(" ")}
    >
      {/* ================================================= */}
      {/* BRAND */}
      {/* ================================================= */}

      <div
        className={`flex h-[70px] shrink-0 items-center gap-3 border-b border-slate-200 [@media(max-height:640px)]:h-14 ${
          collapsed ? "justify-center px-0" : "px-4 lg:px-5"
        }`}
      >
        <Link
          href={`${prefix}/staff`}
          aria-label="Staff Panel - go to dashboard"
          title="Dashboard"
          onClick={onCloseMobile}
          className="group -m-1 flex min-w-0 items-center gap-3 rounded-lg p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
        > 
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-[14px] font-bold text-white shadow-md shadow-indigo-600/30 transition-transform group-hover:scale-105 motion-reduce:transform-none">
            S
          </span>

          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="text-sm font-semibold text-slate-950 transition-colors group-hover:text-indigo-600">
                Staff Panel
              </div>
              <div className="mt-1 text-[11px] text-slate-500">Recruitment</div>
            </div>
          )}
        </Link>

        <button
          type="button"
          aria-label="Close navigation"
          onClick={onCloseMobile}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <nav
        aria-label="Staff navigation"
        className="flex-1 overflow-y-auto overscroll-contain px-3 py-[18px] [scrollbar-width:thin] [@media(max-height:640px)]:py-3"
      >
        {visibleGroups.map((group) => (
          <div
            key={group.label}
            className={
              collapsed
                ? "mt-3.5 border-t border-slate-200 pt-3.5 first:mt-0 first:border-t-0 first:pt-0"
                : "mt-6 first:mt-0 [@media(max-height:640px)]:mt-4"
            }
          >
            {!collapsed && (
              <div className="flex items-center gap-2 px-2 pb-2 text-[10px] font-semibold uppercase text-slate-400 after:h-px after:flex-1 after:bg-slate-200 after:content-['']">
                {group.label}
              </div>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isMenuActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={`${prefix}${item.href}`}
                    className={linkClass(active)}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    onClick={onCloseMobile}
                  >
                    <span className={chipClass(active)}>
                      <Icon className="h-4 w-4" />
                    </span>

                    {!collapsed && (
                      <span className="min-w-0 truncate">{item.label}</span>
                    )}

                    {!collapsed && active && (
                      <span className="ml-auto h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-indigo-600 motion-reduce:animate-none" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ================================================= */}
      {/* PROFILE */}
      {/* ================================================= */}

      <div className="shrink-0 border-t border-slate-200 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div
          className={`flex items-center gap-3 rounded-[10px] border border-slate-200 bg-slate-50 ${
            collapsed ? "justify-center p-1.5" : "p-2"
          }`}
        >
          <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-indigo-200 bg-[linear-gradient(135deg,#eef2ff,#ddd6fe)] text-xs font-bold text-indigo-700">
            {getInitials(staff.name)}

            <span
              aria-hidden="true"
              className="absolute -bottom-px -right-px h-2.5 w-2.5 rounded-full border-2 border-slate-50 bg-emerald-500"
            />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium text-slate-950">
                {staff.name}
              </div>

              <div className="mt-1 text-[11px] text-slate-500">
                Staff ID - {staff.staffId}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          title="Log out"
          aria-label="Log out"
          onClick={onLogout}
          className={`group mt-2 flex h-11 w-full items-center gap-2.5 rounded-lg px-2 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 lg:h-10 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md transition-colors group-hover:bg-red-100">
            <LogOut className="h-4 w-4" />
          </span>

          {!collapsed && <span className="min-w-0 truncate">Log out</span>}
        </button>
      </div>
    </aside>
  );
}