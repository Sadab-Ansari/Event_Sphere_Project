// "use client";

// import { useState, useEffect, useRef } from "react";
// import { usePathname } from "next/navigation";
// import { SocketProvider } from "@/context/SocketContext";
// import SkeletonLoader from "@/components/SkeletonLoader";

// export default function ClientProviders({ children }) {
//   const [loading, setLoading] = useState(false);
//   const pathname = usePathname();
//   const firstLoad = useRef(true); // track if it's the very first render

//   useEffect(() => {
//     if (!pathname) return;

//     if (firstLoad.current) {
//       // Skip loader on first mount
//       firstLoad.current = false;
//       return;
//     }

//     // Show loader only on route changes after first load
//     setLoading(true);
//     const timeout = setTimeout(() => setLoading(false), 1000);
//     return () => clearTimeout(timeout);
//   }, [pathname]);

//   return (
//     <SocketProvider>{loading ? <SkeletonLoader /> : children}</SocketProvider>
//   );
// }
"use client";

import { SocketProvider } from "@/context/SocketContext";

export default function ClientProviders({ children }) {
  return <SocketProvider>{children}</SocketProvider>;
}
