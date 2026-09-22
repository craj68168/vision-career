import type { ReactNode } from "react";

import StaffRouteGuard from "@/components/staff/StaffRouteGuard";

type Props = {
  children: ReactNode;
};

export default function StaffLayout({ children }: Props) {
  return <StaffRouteGuard>{children}</StaffRouteGuard>;
}
