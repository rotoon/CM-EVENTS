"use client";

import { EventForList } from "@/components/admin/types";
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

interface DeleteEventDialogProps {
  open: boolean;
  event: EventForList | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteEventDialog({
  open,
  event,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteEventDialogProps) {
  return (
    <HIGDialog open={open} onOpenChange={onClose}>
      <HIGDialogContent>
        <HIGDialogHeader>
          <HIGDialogTitle>ยืนยันการลบ</HIGDialogTitle>
          <HIGDialogDescription>
            คุณต้องการลบ "{event?.title}" ใช่หรือไม่?
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
