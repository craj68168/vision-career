"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

type StaffHeaderProps = {
  collapsed: boolean;
  isEnglish: boolean;
  japaneseHref: string;
  englishHref: string;
  onToggleCollapsed: () => void;
  onOpenMobile: () => void;
};

export default function StaffHeader({
  collapsed,
  isEnglish,
  japaneseHref,
  englishHref,
  onToggleCollapsed,
  onOpenMobile,
}: StaffHeaderProps) {
  return (
    <header className="workspace-header">
      <button
        type="button"
        className="btn btn-ghost btn-icon only-desktop shrink-0"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleCollapsed}
      >
        {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
      </button>

      <button
        type="button"
        className="btn btn-ghost btn-icon only-mobile shrink-0"
        aria-label="Open navigation"
        onClick={onOpenMobile}
      >
        <PanelLeftOpen />
      </button>

      <div className="sub flex items-center gap-2 text-[11px] uppercase">
        <span className="status-dot" />
        <span>Staff console</span>
      </div>

      <div className="lang-switch" role="group" aria-label="Language">
        <Link
          href={japaneseHref}
          lang="ja"
          hrefLang="ja"
          aria-current={!isEnglish ? "true" : undefined}
          className={`lang-option ${!isEnglish ? "active" : ""}`}
        >
          JA
        </Link>

        <Link
          href={englishHref}
          lang="en"
          hrefLang="en"
          aria-current={isEnglish ? "true" : undefined}
          className={`lang-option ${isEnglish ? "active" : ""}`}
        >
          EN
        </Link>
      </div>
    </header>
  );
}
