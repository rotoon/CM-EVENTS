"use client";

import { DeletePlaceDialog } from "@/components/admin/places/delete-place-dialog";
import { PlaceTable } from "@/components/admin/places/place-table";
import { PlaceForList } from "@/components/admin/types";
import { HIGButton, HIGInput } from "@/components/ui/hig-components";
import { higColors } from "@/components/ui/hig/shared";
import { useAdminPlaces, useDeletePlace } from "@/hooks/use-admin-places";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminPlacesPage() {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    place: PlaceForList | null;
  }>({
    open: false,
    place: null,
  });

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    setSearchQuery(search);
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
        onPageChange={setOffset}
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
