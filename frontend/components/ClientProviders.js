"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SocketProvider } from "@/context/SocketContext";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function ClientProviders({ children }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const firstRender = useRef(true); // track first render

  useEffect(() => {
    if (!pathname) return;

    // Skip loader on first render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Show loader only on navigation
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <SocketProvider>{loading ? <SkeletonLoader /> : children}</SocketProvider>
  );
}
