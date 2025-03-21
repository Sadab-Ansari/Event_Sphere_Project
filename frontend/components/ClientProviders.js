"use client";
import { usePathname } from "next/navigation";
import { SocketProvider } from "@/context/SocketContext";
import SidebarMenu from "@/components/SideMenu";

export default function ClientProviders({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard"; // Hide Sidebar on Dashboard

  return (
    <SocketProvider>
      <div className="flex w-full">
        {!isDashboard && <SidebarMenu />}{" "}
        {/* Sidebar visible on all pages except Dashboard */}
        <main className={`flex-1 ${!isDashboard ? "ml-16 p-4" : ""}`}>
          {children}
        </main>
      </div>
    </SocketProvider>
  );
}
