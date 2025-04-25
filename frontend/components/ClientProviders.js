"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SocketProvider } from "@/context/SocketContext";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function ClientProviders({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Trigger loader on initial load
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000); // 2s on initial page load
    return () => clearTimeout(timeout);
  }, []); // only on first load

  useEffect(() => {
    if (!pathname) return;

    // Trigger loader on route change
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 2000); // 2s on every navigation
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <SocketProvider>{loading ? <SkeletonLoader /> : children}</SocketProvider>
  );
}
