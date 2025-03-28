"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SocketProvider } from "@/context/SocketContext";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function ClientProviders({ children }) {
  const [loading, setLoading] = useState(true); // Start with loading on first load
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate initial loading on page refresh
    setTimeout(() => setLoading(false), 1500); // 1.5 sec delay on first load

    const handleStart = () => setLoading(true);
    const handleStop = () => {
      setTimeout(() => setLoading(false), 1000); // 1 sec delay for smoother transition
    };

    router.events?.on("routeChangeStart", handleStart);
    router.events?.on("routeChangeComplete", handleStop);
    router.events?.on("routeChangeError", handleStop);

    return () => {
      router.events?.off("routeChangeStart", handleStart);
      router.events?.off("routeChangeComplete", handleStop);
      router.events?.off("routeChangeError", handleStop);
    };
  }, []);

  return (
    <SocketProvider>{loading ? <SkeletonLoader /> : children}</SocketProvider>
  );
}
