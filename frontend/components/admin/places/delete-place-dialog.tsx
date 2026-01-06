"use client";

import { PlaceForList } from "@/components/admin/types";
import {
  HIGDialog,
  HIGDialogAction,
  HIGDialogCancel,
  HIGDialogContent,
  HIGDialogDescription,
  HIGDialogFooter,
  HIGDialogHeader,
  HIGDialogTitle,
} from "@/components/ui/hig-components";

interface DeletePlaceDialogProps {
  open: boolean;
  place: PlaceForList | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeletePlaceDialog({
  open,
  place,
  onClose,
  onConfirm,
  isDeleting,
}: DeletePlaceDialogProps) {
  return (
    <HIGDialog open={open} onOpenChange={onClose}>
      <HIGDialogContent>
        <HIGDialogHeader>
          <HIGDialogTitle>ยืนยันการลบ</HIGDialogTitle>
          <HIGDialogDescription>
            คุณต้องการลบ "{place?.name}" ใช่หรือไม่?
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </HIGDialogDescription>
        </HIGDialogHeader>
        <HIGDialogFooter>
          <HIGDialogCancel onClick={onClose}>ยกเลิก</HIGDialogCancel>
          <HIGDialogAction
            destructive
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "กำลังลบ..." : "ลบ"}
          </HIGDialogAction>
        </HIGDialogFooter>
      </HIGDialogContent>
    </HIGDialog>
  );
}
