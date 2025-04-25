"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // Use replace to prevent going back
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  if (isCheckingAuth) {
    return null; // Optionally add a loading spinner here
  }

  return <>{children}</>;
};

export default ProtectedRoute;
