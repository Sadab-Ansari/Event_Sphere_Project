"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SocketProvider } from "@/context/SocketContext";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function ClientProviders({ children }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const isFirstLoad = useRef(true); // track first load

  useEffect(() => {
    if (isFirstLoad.current) {
      //  Skip loader on very first page load
      isFirstLoad.current = false;
      return;
    }

    //  Show loader only on navigation
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000); // adjust timing as you like
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <SocketProvider>{loading ? <SkeletonLoader /> : children}</SocketProvider>
  );
}
