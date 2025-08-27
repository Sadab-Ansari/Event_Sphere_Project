"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // redirect if not logged in
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

    setIsCheckingAuth(false); //  always finish checking
  }, [router]);

  if (isCheckingAuth) {
    return <p className="text-white text-center">Checking auth...</p>; // loader
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
