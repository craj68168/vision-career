import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Job Seeker Sign In and Registration",
  description: "Sign in or create a Vision Career job seeker account.",
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
