import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Job Seeker Dashboard",
  description:
    "Manage your Vision Career profile, applications, and interviews.",
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
