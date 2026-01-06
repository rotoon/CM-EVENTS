"use client";

import { higColors } from "@/components/ui/hig/shared";
import {
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "แดชบอร์ด", icon: LayoutDashboard },
    { href: "/admin/events", label: "จัดการ Events", icon: CalendarDays },
    { href: "/admin/places", label: "จัดการ Places", icon: MapPin },
  ];

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          backgroundColor: higColors.bgPrimary,
          borderRight: `0.5px solid ${higColors.separator}`,
        }}
      >
        {/* Logo Section */}
        <div
          className="p-5 hidden lg:block"
          style={{ borderBottom: `0.5px solid ${higColors.separator}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-white"
              style={{ backgroundColor: higColors.blue }}
            >
              H
            </div>
            <div>
              <h1
                className="font-semibold"
                style={{ color: higColors.labelPrimary, fontSize: "17px" }}
              >
                HYPE CNX
              </h1>
              <p style={{ color: higColors.labelSecondary, fontSize: "13px" }}>
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - List Style */}
        <nav className="p-3">
          <p
            className="px-3 py-2 uppercase tracking-wide"
            style={{
              color: higColors.labelSecondary,
              fontSize: "13px",
              fontWeight: 400,
            }}
          >
            เมนูหลัก
          </p>

          <div
            className="mt-1 rounded-xl overflow-hidden"
            style={{ backgroundColor: higColors.bgSecondary }}
          >
            {navItems.map((item, idx) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{
                    backgroundColor: isActive
                      ? higColors.bgPrimary
                      : "transparent",
                    color: isActive ? higColors.blue : higColors.labelPrimary,
                    borderBottom:
                      idx < navItems.length - 1
                        ? `0.5px solid ${higColors.separator}`
                        : "none",
                    fontSize: "17px",
                    minHeight: "44px",
                  }}
                >
                  <item.icon
                    size={22}
                    style={{
                      color: isActive ? higColors.blue : higColors.gray,
                    }} // gray not in shared? Let's fix that.
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight
                      size={16}
                      style={{ color: "rgba(60, 60, 67, 0.3)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3"
          style={{ borderTop: `0.5px solid ${higColors.separator}` }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer"
            style={{
              backgroundColor: higColors.bgSecondary,
              color: higColors.red,
              fontSize: "17px",
              minHeight: "44px",
            }}
          >
            <LogOut size={22} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          onClick={onClose}
        />
      )}
    </>
  );
}
