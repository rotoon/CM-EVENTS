"use client";

import { AdminPagination, PlaceForList } from "@/components/admin/types";
import {
  HIGButton,
  HIGSelect,
  HIGSelectContent,
  HIGSelectItem,
  HIGSelectTrigger,
  HIGSelectValue,
} from "@/components/ui/hig-components";
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
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PlaceTableProps {
  places: PlaceForList[];
  isLoading: boolean;
  pagination: AdminPagination;
  onPageChange: (offset: number) => void;
  onLimitChange?: (limit: number) => void;
  onDeleteClick: (place: PlaceForList) => void;
}

export function PlaceTable({
  places,
  isLoading,
  pagination,
  onPageChange,
  onLimitChange,
  onDeleteClick,
}: PlaceTableProps) {
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

  if (places.length === 0) {
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
            <MapPin size={24} style={{ color: higColors.blue }} />
          </div>
          <p style={{ color: higColors.labelSecondary }}>ไม่พบ Places</p>
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
              className="py-4 px-4 font-semibold text-sm"
              style={{ color: higColors.labelPrimary }}
            >
              ชื่อ Place
            </TableHead>
            <TableHead
              className="hidden md:table-cell py-4 px-4 font-semibold text-sm min-w-[120px]"
              style={{ color: higColors.labelPrimary }}
            >
              ประเภท
            </TableHead>
            <TableHead
              className="hidden lg:table-cell py-4 px-4 font-semibold text-sm min-w-[200px]"
              style={{ color: higColors.labelPrimary }}
            >
              Categories
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
          {places.map((place) => (
            <TableRow
              key={place.id}
              className="hover:bg-blue-50/50 transition-colors cursor-pointer border-b"
              style={{ borderColor: higColors.separator }}
            >
              <TableCell className="py-4 px-6">
                <div
                  className="w-16 h-16 rounded-xl overflow-hidden shadow-sm"
                  style={{ backgroundColor: `${higColors.blue}10` }}
                >
                  {place.images.length > 0 ? (
                    <Image
                      src={place.images[0].image_url}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin size={24} style={{ color: higColors.blue }} />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4 px-4">
                <div
                  className="font-semibold text-base line-clamp-2 max-w-[300px]"
                  style={{ color: higColors.labelPrimary }}
                >
                  {place.name}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell py-4 px-4">
                <span
                  className="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: `${higColors.blue}10`,
                    color: higColors.blue,
                  }}
                >
                  {place.place_type}
                </span>
              </TableCell>
              <TableCell
                className="hidden lg:table-cell py-4 px-4 text-sm"
                style={{ color: higColors.labelSecondary }}
              >
                <div className="flex flex-wrap gap-1">
                  {place.category_names.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs px-2 py-0.5 rounded bg-gray-100"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="py-4 px-4">
                <div className="flex gap-2 justify-center">
                  <Link href={`/admin/places/${place.id}/edit`}>
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
                    onClick={() => onDeleteClick(place)}
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
      {totalPages > 0 && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4"
          style={{ borderTop: `1px solid ${higColors.separator}` }}
        >
          <div className="flex items-center gap-4">
            {onLimitChange && (
              <div className="flex items-center gap-2">
                <p
                  className="text-sm"
                  style={{ color: higColors.labelSecondary }}
                >
                  แสดง
                </p>
                <HIGSelect
                  value={pagination.limit.toString()}
                  onValueChange={(val) => onLimitChange(Number(val))}
                >
                  <HIGSelectTrigger
                    className="h-8 w-[70px]"
                    style={{ backgroundColor: higColors.bgSecondary }}
                  >
                    <HIGSelectValue />
                  </HIGSelectTrigger>
                  <HIGSelectContent>
                    {[10, 20, 50, 100].map((pageSize) => (
                      <HIGSelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </HIGSelectItem>
                    ))}
                  </HIGSelectContent>
                </HIGSelect>
                <p
                  className="text-sm"
                  style={{ color: higColors.labelSecondary }}
                >
                  ต่อหน้า
                </p>
              </div>
            )}
            <p className="text-sm" style={{ color: higColors.labelSecondary }}>
              หน้า {currentPage} จาก {totalPages} ({pagination.total} รายการ)
            </p>
          </div>

          <div className="flex items-center gap-1">
            <HIGButton
              variant="outline"
              size="sm"
              className="rounded-lg cursor-pointer h-9 w-9 p-0"
              disabled={currentPage === 1}
              onClick={() => onPageChange((currentPage - 2) * pagination.limit)}
            >
              <ChevronLeft size={16} />
            </HIGButton>

            {(() => {
              const pages: (number | string)[] = [];
              const showPages = 5;
              let start = Math.max(1, currentPage - Math.floor(showPages / 2));
              const end = Math.min(totalPages, start + showPages - 1);
              start = Math.max(1, end - showPages + 1);
              // Ensure start is at least 1
              if (start < 1) start = 1;

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
