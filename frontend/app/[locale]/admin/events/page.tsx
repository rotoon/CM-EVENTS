"use client";

import { DeleteEventDialog } from "@/components/admin/events/delete-event-dialog";
import { EventTable } from "@/components/admin/events/event-table";
import { EventForList } from "@/components/admin/types";
import {
  HIGButton,
  HIGInput,
  HIGSelect,
  HIGSelectContent,
  HIGSelectItem,
  HIGSelectTrigger,
  HIGSelectValue,
} from "@/components/ui/hig-components";
import { higColors } from "@/components/ui/hig/shared";
import {
  useAdminEvents,
  useDeleteEvent,
  useEventMonths,
} from "@/hooks/use-admin";
import { syncEventStatus } from "@/lib/admin-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, RefreshCw, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminEventsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // URL Params
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const searchQuery = searchParams.get("search") || "";
  const monthParams = searchParams.get("month") || undefined;
  const statusParams = searchParams.get("status") || undefined;

  // Local state for search input
  const [search, setSearch] = useState(searchQuery);

  const offset = (page - 1) * limit;

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    event: EventForList | null;
  }>({
    open: false,
    event: null,
  });

  const { data, isLoading } = useAdminEvents(
    offset,
    limit,
    searchQuery || undefined,
    monthParams,
    undefined, // category
    statusParams
  );
  const { data: months } = useEventMonths();
  const deleteMutation = useDeleteEvent();

  const syncMutation = useMutation({
    mutationFn: syncEventStatus,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sync status");
    },
  });

  const handleSyncStatus = () => {
    syncMutation.mutate();
  };

  const events = (data?.events || []) as EventForList[];
  const pagination = data?.pagination || {
    total: 0,
    limit,
    offset,
    hasMore: false,
  };

  const updateUrl = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (key === "page") {
        if (Number(value) === 1 || !value) params.delete("page");
        else params.set("page", String(value));
        return;
      }

      if (key === "limit") {
        if (Number(value) === 20 || !value) params.delete("limit");
        else params.set("limit", String(value));
        return;
      }

      if (value === null || value === "" || value === 0 || value === "all") {
        if (key === "search") params.delete("search");
        else params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search, page: 1 });
  };

  const handlePageChange = (newOffset: number) => {
    const newPage = Math.floor(newOffset / limit) + 1;
    updateUrl({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    updateUrl({ limit: newLimit, page: 1 });
  };

  const handleDelete = async () => {
    if (!deleteDialog.event) return;

    deleteMutation.mutate(deleteDialog.event.id, {
      onSuccess: () => {
        setDeleteDialog({ open: false, event: null });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: higColors.labelPrimary }}
          >
            จัดการ Events
          </h1>
          <p style={{ color: higColors.labelSecondary }}>
            รายการ Events ({pagination.total.toLocaleString()})
          </p>
        </div>
        <div className="flex gap-2">
          <HIGButton
            variant="outline"
            className="gap-2 h-11 px-4 rounded-xl font-medium cursor-pointer bg-white"
            onClick={handleSyncStatus}
            disabled={syncMutation.isPending}
          >
            {syncMutation.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
            Sync Status
          </HIGButton>
          <Link href="/admin/events/new">
            <HIGButton
              className="gap-2 h-11 px-5 rounded-xl font-medium cursor-pointer"
              style={{
                backgroundColor: higColors.blue,
                boxShadow: `0 4px 14px ${higColors.blue}40`,
              }}
            >
              <Plus size={18} />
              เพิ่ม Event ใหม่
            </HIGButton>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div
        className="rounded-2xl p-4 space-y-4 md:space-y-0 md:flex md:gap-4"
        style={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${higColors.separator}`,
        }}
      >
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 flex-1">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: higColors.labelSecondary }}
            />
            <HIGInput
              placeholder="ค้นหา Events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 rounded-xl border-2 w-full"
              style={{ borderColor: higColors.separator }}
            />
          </div>
          <HIGButton
            type="submit"
            className="h-11 px-6 rounded-xl cursor-pointer"
            style={{ backgroundColor: higColors.blue }}
          >
            ค้นหา
          </HIGButton>
        </form>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
          {/* Status Filter */}
          <div className="w-[140px] shrink-0">
            <HIGSelect
              value={statusParams || "all"}
              onValueChange={(val) => updateUrl({ status: val, page: 1 })}
            >
              <HIGSelectTrigger className="h-11 rounded-xl bg-white">
                <HIGSelectValue placeholder="สถานะ" />
              </HIGSelectTrigger>
              <HIGSelectContent>
                <HIGSelectItem value="all">ทั้งหมด</HIGSelectItem>
                <HIGSelectItem value="active">Active</HIGSelectItem>
                <HIGSelectItem value="ended">Ended</HIGSelectItem>
              </HIGSelectContent>
            </HIGSelect>
          </div>

          {/* Month Filter */}
          <div className="w-[180px] shrink-0">
            <HIGSelect
              value={monthParams || "all"}
              onValueChange={(val) => updateUrl({ month: val, page: 1 })}
            >
              <HIGSelectTrigger className="h-11 rounded-xl bg-white">
                <HIGSelectValue placeholder="เลือกเดือน" />
              </HIGSelectTrigger>
              <HIGSelectContent>
                <HIGSelectItem value="all">ทุกเดือน</HIGSelectItem>
                {months?.map((m) => (
                  <HIGSelectItem key={m} value={m}>
                    {m}
                  </HIGSelectItem>
                ))}
              </HIGSelectContent>
            </HIGSelect>
          </div>

          {/* Clear Filters Button */}
          {(statusParams || monthParams || searchQuery) && (
            <HIGButton
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl border-2"
              style={{ borderColor: higColors.separator }}
              onClick={() => {
                setSearch("");
                updateUrl({ status: null, month: null, search: null, page: 1 });
              }}
            >
              <X size={18} style={{ color: higColors.labelSecondary }} />
            </HIGButton>
          )}
        </div>
      </div>

      {/* Table */}
      <EventTable
        events={events}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onDeleteClick={(event) => setDeleteDialog({ open: true, event })}
      />

      {/* Delete Dialog */}
      <DeleteEventDialog
        open={deleteDialog.open}
        event={deleteDialog.event}
        onClose={() => setDeleteDialog({ open: false, event: null })}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
