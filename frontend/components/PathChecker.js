"use client";

import { usePathname } from "next/navigation";

export default function PathChecker({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return isDashboard ? null : <>{children}</>; // Hide children if on dashboard
}
