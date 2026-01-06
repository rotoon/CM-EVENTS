"use client";

import {
  HIGButton,
  HIGCard,
  HIGCardContent,
  HIGCardHeader,
  HIGCardTitle,
  HIGInput,
  HIGLabel,
  HIGTextarea,
  higColors,
} from "@/components/ui/hig-components";
import { useCreateEvent } from "@/hooks/use-admin";
import { EventFormData } from "@/lib/admin-api";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewEventPage() {
  const router = useRouter();
  const createMutation = useCreateEvent();

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description_markdown: "",
    location: "",
    date_text: "",
    time_text: "",
    cover_image_url: "",
    latitude: "",
    longitude: "",
    google_maps_url: "",
    facebook_url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: () => {
        router.push("/admin/events");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <HIGButton variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </HIGButton>
        </Link>
        <div>
          <h1
            style={{
              color: higColors.labelPrimary,
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            เพิ่ม Event ใหม่
          </h1>
          <p style={{ color: higColors.labelSecondary, fontSize: "15px" }}>
            กรอกข้อมูล Event ที่ต้องการเพิ่ม
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <HIGCard>
              <HIGCardHeader>
                <HIGCardTitle>ข้อมูลหลัก</HIGCardTitle>
              </HIGCardHeader>
              <HIGCardContent className="space-y-4">
                <div className="space-y-2">
                  <HIGLabel htmlFor="title">ชื่อ Event *</HIGLabel>
                  <HIGInput
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="ชื่อ Event"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <HIGLabel htmlFor="description_markdown">รายละเอียด</HIGLabel>
                  <HIGTextarea
                    id="description_markdown"
                    name="description_markdown"
                    value={formData.description_markdown}
                    onChange={handleChange}
                    placeholder="รายละเอียด Event"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <HIGLabel htmlFor="date_text">วันที่</HIGLabel>
                    <HIGInput
                      id="date_text"
                      name="date_text"
                      value={formData.date_text}
                      onChange={handleChange}
                      placeholder="เช่น 1-31 มกราคม 2568"
                    />
                  </div>
                  <div className="space-y-2">
                    <HIGLabel htmlFor="time_text">เวลา</HIGLabel>
                    <HIGInput
                      id="time_text"
                      name="time_text"
                      value={formData.time_text}
                      onChange={handleChange}
                      placeholder="เช่น 10:00 - 22:00"
                    />
                  </div>
                </div>
              </HIGCardContent>
            </HIGCard>

            <HIGCard>
              <HIGCardHeader>
                <HIGCardTitle>สถานที่</HIGCardTitle>
              </HIGCardHeader>
              <HIGCardContent className="space-y-4">
                <div className="space-y-2">
                  <HIGLabel htmlFor="location">ชื่อสถานที่</HIGLabel>
                  <HIGInput
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="เช่น One Nimman, Chiang Mai"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <HIGLabel htmlFor="latitude">Latitude</HIGLabel>
                    <HIGInput
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="18.7883"
                    />
                  </div>
                  <div className="space-y-2">
                    <HIGLabel htmlFor="longitude">Longitude</HIGLabel>
                    <HIGInput
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="98.9853"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <HIGLabel htmlFor="google_maps_url">Google Maps URL</HIGLabel>
                  <HIGInput
                    id="google_maps_url"
                    name="google_maps_url"
                    value={formData.google_maps_url}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </HIGCardContent>
            </HIGCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <HIGCard>
              <HIGCardHeader>
                <HIGCardTitle>รูปภาพ</HIGCardTitle>
              </HIGCardHeader>
              <HIGCardContent className="space-y-4">
                <div className="space-y-2">
                  <HIGLabel htmlFor="cover_image_url">URL รูปปก</HIGLabel>
                  <HIGInput
                    id="cover_image_url"
                    name="cover_image_url"
                    value={formData.cover_image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
                {formData.cover_image_url && (
                  <div
                    className="aspect-video rounded-xl overflow-hidden"
                    style={{ backgroundColor: higColors.bgSecondary }}
                  >
                    <img
                      src={formData.cover_image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </HIGCardContent>
            </HIGCard>

            <HIGCard>
              <HIGCardHeader>
                <HIGCardTitle>ลิงก์</HIGCardTitle>
              </HIGCardHeader>
              <HIGCardContent className="space-y-4">
                <div className="space-y-2">
                  <HIGLabel htmlFor="facebook_url">Facebook URL</HIGLabel>
                  <HIGInput
                    id="facebook_url"
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </HIGCardContent>
            </HIGCard>

            {/* Actions */}
            <HIGCard>
              <HIGCardContent className="space-y-3">
                {createMutation.error && (
                  <div
                    className="text-sm p-3 rounded-xl"
                    style={{
                      backgroundColor: "rgba(255, 59, 48, 0.1)",
                      color: higColors.red,
                    }}
                  >
                    {createMutation.error.message}
                  </div>
                )}
                <HIGButton
                  type="submit"
                  className="w-full gap-2"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      บันทึก Event
                    </>
                  )}
                </HIGButton>
                <Link href="/admin/events" className="block">
                  <HIGButton type="button" variant="outline" className="w-full">
                    ยกเลิก
                  </HIGButton>
                </Link>
              </HIGCardContent>
            </HIGCard>
          </div>
        </div>
      </form>
    </div>
  );
}
