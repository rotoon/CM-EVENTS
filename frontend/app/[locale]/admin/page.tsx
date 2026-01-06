"use client";

import { HIGButton } from "@/components/ui/hig-components";
import { useAdminDashboard } from "@/hooks/use-admin";
import {
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react";
import Link from "next/link";

// Apple HIG System Colors
const hig = {
  blue: "#007AFF",
  green: "#34C759",
  orange: "#FF9500",
  red: "#FF3B30",
  gray: "#8E8E93",
  gray6: "#F2F2F7",
  labelPrimary: "#000000",
  labelSecondary: "rgba(60, 60, 67, 0.6)",
  labelTertiary: "rgba(60, 60, 67, 0.3)",
  bgPrimary: "#FFFFFF",
  bgSecondary: "#F2F2F7",
  separator: "rgba(60, 60, 67, 0.12)",
};

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
          style={{
            borderColor: `${hig.blue} transparent ${hig.blue} ${hig.blue}`,
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255, 59, 48, 0.1)" }}
        >
          <span className="text-2xl">⚠️</span>
        </div>
        <p style={{ color: hig.red, fontSize: "17px", marginBottom: "16px" }}>
          {error.message}
        </p>
        <HIGButton
          onClick={() => refetch()}
          className="rounded-full px-6"
          style={{
            backgroundColor: hig.blue,
            fontSize: "17px",
            fontWeight: 600,
          }}
        >
          ลองใหม่
        </HIGButton>
      </div>
    );
  }

  const stats = data?.stats;
  const recentEvents = data?.recentEvents || [];

  const statCards = [
    {
      title: "Events ทั้งหมด",
      value: stats?.total || 0,
      icon: CalendarDays,
      color: hig.blue,
    },
    {
      title: "พร้อมแสดง",
      value: stats?.fullyScraped || 0,
      icon: CheckCircle,
      color: hig.green,
    },
    {
      title: "รอดำเนินการ",
      value: stats?.pending || 0,
      icon: Clock,
      color: hig.orange,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            style={{
              color: hig.labelPrimary,
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            แดชบอร์ด
          </h1>
          <p
            style={{
              color: hig.labelSecondary,
              fontSize: "15px",
              marginTop: "4px",
            }}
          >
            ภาพรวมระบบ HYPE CNX
          </p>
        </div>
        <Link href="/admin/events/new">
          <HIGButton
            className="gap-2 rounded-xl px-6 cursor-pointer"
            style={{
              backgroundColor: hig.blue,
              fontSize: "17px",
              fontWeight: 600,
              minHeight: "44px",
            }}
          >
            <Plus size={18} />
            เพิ่ม Event ใหม่
          </HIGButton>
        </Link>
      </div>

      {/* Stats Cards - iOS Grouped Style */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: hig.bgPrimary }}
      >
        {statCards.map((stat, idx) => (
          <div
            key={stat.title}
            className="flex items-center justify-between px-4 py-4"
            style={{
              borderBottom:
                idx < statCards.length - 1
                  ? `0.5px solid ${hig.separator}`
                  : "none",
              minHeight: "60px",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <span style={{ color: hig.labelPrimary, fontSize: "17px" }}>
                {stat.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  color: hig.labelSecondary,
                  fontSize: "17px",
                  fontWeight: 500,
                }}
              >
                {stat.value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events - iOS List Style */}
      <div>
        <div className="flex items-center justify-between px-4 mb-2">
          <h2
            style={{
              color: hig.labelSecondary,
              fontSize: "13px",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            Events ล่าสุด
          </h2>
          <Link href="/admin/events">
            <button
              className="cursor-pointer"
              style={{ color: hig.blue, fontSize: "13px" }}
            >
              ดูทั้งหมด
            </button>
          </Link>
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: hig.bgPrimary }}
        >
          {recentEvents.length === 0 ? (
            <div className="text-center py-12">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${hig.blue}15` }}
              >
                <CalendarDays size={28} style={{ color: hig.blue }} />
              </div>
              <p style={{ color: hig.labelSecondary, fontSize: "17px" }}>
                ยังไม่มี Events
              </p>
              <Link href="/admin/events/new">
                <HIGButton
                  className="mt-4 rounded-full px-6 cursor-pointer"
                  style={{
                    backgroundColor: hig.blue,
                    fontSize: "17px",
                    fontWeight: 600,
                  }}
                >
                  เพิ่ม Event แรก
                </HIGButton>
              </Link>
            </div>
          ) : (
            recentEvents.map((event, idx) => (
              <Link
                key={event.id}
                href={`/admin/events/${event.id}/edit`}
                className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50"
                style={{
                  borderBottom:
                    idx < recentEvents.length - 1
                      ? `0.5px solid ${hig.separator}`
                      : "none",
                  minHeight: "60px",
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: `${hig.blue}15` }}
                >
                  {event.cover_image_url ? (
                    <img
                      src={event.cover_image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarDays size={20} style={{ color: hig.blue }} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="truncate"
                    style={{ color: hig.labelPrimary, fontSize: "17px" }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="truncate"
                    style={{ color: hig.labelSecondary, fontSize: "15px" }}
                  >
                    {event.location || event.date_text || "ไม่ระบุ"}
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: hig.labelTertiary }} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
