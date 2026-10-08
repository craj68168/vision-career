import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "求職者ダッシュボード",
  description:
    "Vision Careerのプロフィール、応募状況、面接予定を管理できます。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JobSeekersLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
