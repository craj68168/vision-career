import type { ReactNode } from "react";

import StaffRouteGuard from "@/components/staff/StaffRouteGuard";

type Props = {
  children: ReactNode;
};

export default function StaffEnglishLayout({ children }: Props) {
  return <StaffRouteGuard>{children}</StaffRouteGuard>;
}
