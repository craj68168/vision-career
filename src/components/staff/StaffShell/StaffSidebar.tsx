"use client";

import Link from "next/link";
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

  return (
    <aside
      className={`workspace-sidebar ${collapsed ? "collapsed" : ""} ${
        mobileOpen ? "mobile-open" : "mobile-closed"
      }`}
      aria-label="Staff sidebar"
    >
      <div className="sidebar-brand">
        <span className="brand-mark">S</span>

        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <div className="font-display text-sm font-semibold">Staff Panel</div>
            <div className="sub mt-1 text-[11px]">Recruitment</div>
          </div>
        )}

        <button
          type="button"
          className="btn btn-ghost btn-icon only-mobile ml-auto"
          aria-label="Close navigation"
          onClick={onCloseMobile}
        >
          <X />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Staff navigation">
        {visibleGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            {!collapsed && <div className="nav-group-title">{group.label}</div>}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isMenuActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={`${prefix}${item.href}`}
                    className={`nav-link ${active ? "active" : ""}`}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    onClick={onCloseMobile}
                  >
                    <Icon />
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && active && <span className="status-dot ml-auto" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-profile">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="profile-avatar">{getInitials(staff.name)}</div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-[13px]">{staff.name}</div>
              <div className="sub mt-1 text-[11px]">
                Staff ID - {staff.staffId}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="nav-link logout mt-2"
          title="Log out"
          aria-label="Log out"
          onClick={onLogout}
        >
          <LogOut />
          {!collapsed && "Log out"}
        </button>
      </div>
    </aside>
  );
}
