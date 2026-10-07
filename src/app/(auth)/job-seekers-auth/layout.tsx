import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "求職者ログイン・新規登録",
  description:
    "Vision Careerの求職者アカウントにログイン、または新規登録できます。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JobSeekerAuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
