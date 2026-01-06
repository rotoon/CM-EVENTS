"use client";

import { DeletePlaceDialog } from "@/components/admin/places/delete-place-dialog";
import { PlaceTable } from "@/components/admin/places/place-table";
import { PlaceForList } from "@/components/admin/types";
import { HIGButton, HIGInput } from "@/components/ui/hig-components";
import { higColors } from "@/components/ui/hig/shared";
import { useAdminPlaces, useDeletePlace } from "@/hooks/use-admin-places";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminPlacesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL Params
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const searchQuery = searchParams.get("search") || "";

  // Local state for search input
  const [search, setSearch] = useState(searchQuery);

  const offset = (page - 1) * limit;

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    place: PlaceForList | null;
  }>({
    open: false,
    place: null,
  });

  // Sync search input with URL if URL changes externally
  // useEffect(() => {
  //   setSearch(searchQuery);
  // }, [searchQuery]);

  const { data, isLoading } = useAdminPlaces(
    offset,
    limit,
    searchQuery || undefined
  );
  const deleteMutation = useDeletePlace();

  const places = (data?.places || []) as PlaceForList[];
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

      if (value === null || value === "" || value === 0) {
        if (key === "search") params.delete("search");
        // For other params, if empty/0, delete them
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
    if (!deleteDialog.place) return;

    deleteMutation.mutate(deleteDialog.place.id, {
      onSuccess: () => {
        setDeleteDialog({ open: false, place: null });
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
            จัดการ Places
          </h1>
          <p style={{ color: higColors.labelSecondary }}>
            ร้านอาหาร/คาเฟ่ทั้งหมด {pagination.total.toLocaleString()} รายการ
          </p>
        </div>
        <Link href="/admin/places/new">
          <HIGButton
            className="gap-2 h-11 px-5 rounded-xl font-medium cursor-pointer"
            style={{
              backgroundColor: higColors.blue,
              boxShadow: `0 4px 14px ${higColors.blue}40`,
            }}
          >
            <Plus size={18} />
            เพิ่ม Place ใหม่
          </HIGButton>
        </Link>
      </div>

      {/* Search */}
      <div
        className="rounded-2xl p-4"
        style={{
          backgroundColor: "#FFFFFF",
          border: `1px solid ${higColors.separator}`,
        }}
      >
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: higColors.labelSecondary }}
            />
            <HIGInput
              placeholder="ค้นหา Places..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 rounded-xl border-2"
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
      </div>

      {/* Table */}
      <PlaceTable
        places={places}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onDeleteClick={(place) => setDeleteDialog({ open: true, place })}
      />

      {/* Delete Dialog */}
      <DeletePlaceDialog
        open={deleteDialog.open}
        place={deleteDialog.place}
        onClose={() => setDeleteDialog({ open: false, place: null })}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
