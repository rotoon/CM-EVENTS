"use client";

import { AdminMobileHeader } from "@/components/admin/admin-mobile-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { higColors } from "@/components/ui/hig/shared";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./hig-styles.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token && !pathname.includes("/admin/login")) {
      router.push("/admin/login");
    } else if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [pathname, router]);

  // Show login page without layout
  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: higColors.bgSecondary,
          fontFamily: "var(--hig-font-system)",
        }}
      >
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
          style={{
            borderColor: `${higColors.blue} transparent ${higColors.blue} ${higColors.blue}`,
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: higColors.bgSecondary,
        fontFamily: "var(--hig-font-system)",
      }}
    >
      <AdminMobileHeader
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex">
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-screen">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
