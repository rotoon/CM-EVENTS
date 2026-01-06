"use client";

import { AdminPagination, EventForList } from "@/components/admin/types";
import { HIGButton } from "@/components/ui/hig-components";
import { higColors } from "@/components/ui/hig/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface EventTableProps {
  events: EventForList[];
  isLoading: boolean;
  pagination: AdminPagination;
  onPageChange: (offset: number) => void;
  onDeleteClick: (event: EventForList) => void;
}

export function EventTable({
  events,
  isLoading,
  pagination,
  onPageChange,
  onDeleteClick,
}: EventTableProps) {
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (isLoading) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${higColors.separator}`,
        }}
      >
        <div className="flex items-center justify-center py-16">
          <div
            className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent"
            style={{
              borderColor: `${higColors.blue} transparent ${higColors.blue} ${higColors.blue}`,
            }}
          />
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${higColors.separator}`,
        }}
      >
        <div className="text-center py-16">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${higColors.blue}10` }}
          >
            <CalendarDays size={24} style={{ color: higColors.blue }} />
          </div>
          <p style={{ color: higColors.labelSecondary }}>ไม่พบ Events</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${higColors.separator}`,
      }}
    >
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: "#F2F2F7" }}>
            <TableHead
              className="w-[100px] py-4 px-6 font-semibold text-sm"
              style={{ color: higColors.labelPrimary }}
            >
              รูป
            </TableHead>
            <TableHead
              className="py-4 px-4 font-semibold text-sm w-[50px]"
              style={{ color: higColors.labelPrimary }}
            >
              ชื่อ Event
            </TableHead>
            <TableHead
              className="hidden md:table-cell py-4 px-4 font-semibold text-sm min-w-[180px]"
              style={{ color: higColors.labelPrimary }}
            >
              สถานที่
            </TableHead>
            <TableHead
              className="hidden lg:table-cell py-4 px-4 font-semibold text-sm min-w-[150px]"
              style={{ color: higColors.labelPrimary }}
            >
              วันที่
            </TableHead>
            <TableHead
              className="w-[120px] py-4 px-4 font-semibold text-sm text-center"
              style={{ color: higColors.labelPrimary }}
            >
              จัดการ
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              className="hover:bg-blue-50/50 transition-colors cursor-pointer border-b"
              style={{ borderColor: higColors.separator }}
            >
              <TableCell className="py-4 px-6">
                <div
                  className="w-16 h-16 rounded-xl overflow-hidden shadow-sm"
                  style={{ backgroundColor: `${higColors.blue}10` }}
                >
                  {event.cover_image_url ? (
                    <img
                      src={event.cover_image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarDays
                        size={24}
                        style={{ color: higColors.blue }}
                      />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4 px-4">
                <div
                  className="font-semibold text-base line-clamp-2 mb-1 max-w-[400px] truncate"
                  style={{ color: higColors.labelPrimary }}
                >
                  {event.title}
                </div>
                {event.is_ended && (
                  <span
                    className="inline-block text-xs px-2.5 py-1 rounded-full font-medium mt-1"
                    style={{
                      backgroundColor: "#FEE2E2",
                      color: higColors.red,
                    }}
                  >
                    จบแล้ว
                  </span>
                )}
              </TableCell>
              <TableCell
                className="hidden md:table-cell py-4 px-4 text-sm"
                style={{ color: higColors.labelSecondary }}
              >
                {event.location || "-"}
              </TableCell>
              <TableCell
                className="hidden lg:table-cell py-4 px-4 text-sm"
                style={{ color: higColors.labelSecondary }}
              >
                {event.date_text || "-"}
              </TableCell>
              <TableCell className="py-4 px-4">
                <div className="flex gap-2 justify-center">
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <HIGButton
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-blue-100 cursor-pointer transition-all"
                    >
                      <Pencil size={18} style={{ color: higColors.blue }} />
                    </HIGButton>
                  </Link>
                  <HIGButton
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-red-100 cursor-pointer transition-all"
                    onClick={() => onDeleteClick(event)}
                  >
                    <Trash2 size={18} style={{ color: higColors.red }} />
                  </HIGButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between p-4"
          style={{ borderTop: `1px solid ${higColors.separator}` }}
        >
          <p className="text-sm" style={{ color: higColors.labelSecondary }}>
            แสดง {pagination.offset + 1}-
            {Math.min(pagination.offset + pagination.limit, pagination.total)}{" "}
            จาก {pagination.total} รายการ
          </p>
          <div className="flex items-center gap-1">
            {/* Previous */}
            <HIGButton
              variant="outline"
              size="sm"
              className="rounded-lg cursor-pointer h-9 w-9 p-0"
              disabled={currentPage === 1}
              onClick={() => onPageChange((currentPage - 2) * pagination.limit)}
            >
              <ChevronLeft size={16} />
            </HIGButton>

            {/* Page Numbers */}
            {(() => {
              const pages: (number | string)[] = [];
              const showPages = 5;
              let start = Math.max(1, currentPage - Math.floor(showPages / 2));
              const end = Math.min(totalPages, start + showPages - 1);
              start = Math.max(1, end - showPages + 1);

              if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push("...");
              }

              for (let i = start; i <= end; i++) {
                pages.push(i);
              }

              if (end < totalPages) {
                if (end < totalPages - 1) pages.push("...");
                pages.push(totalPages);
              }

              return pages.map((page, idx) =>
                typeof page === "number" ? (
                  <HIGButton
                    key={idx}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className="rounded-lg cursor-pointer h-9 w-9 p-0 text-sm font-medium"
                    style={
                      page === currentPage
                        ? { backgroundColor: higColors.blue }
                        : {}
                    }
                    onClick={() => onPageChange((page - 1) * pagination.limit)}
                  >
                    {page}
                  </HIGButton>
                ) : (
                  <span
                    key={idx}
                    className="px-1"
                    style={{ color: higColors.labelSecondary }}
                  >
                    {page}
                  </span>
                )
              );
            })()}

            {/* Next */}
            <HIGButton
              variant="outline"
              size="sm"
              className="rounded-lg cursor-pointer h-9 w-9 p-0"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage * pagination.limit)}
            >
              <ChevronRight size={16} />
            </HIGButton>
          </div>
        </div>
      )}
    </div>
  );
}
