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
import { useAdminEvent, useUpdateEvent } from "@/hooks/use-admin";
import { EventFormData } from "@/lib/admin-api";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = parseInt(params.id as string);

  const { data: event, isLoading, error } = useAdminEvent(eventId);
  const updateMutation = useUpdateEvent(eventId);

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    location: "",
    date_text: "",
    time_text: "",
    cover_image_url: "",
    latitude: "",
    longitude: "",
    google_maps_url: "",
    facebook_url: "",
    is_ended: false,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
        date_text: event.date_text || "",
        time_text: event.time_text || "",
        cover_image_url: event.cover_image_url || "",
        latitude: event.latitude?.toString() || "",
        longitude: event.longitude?.toString() || "",
        google_maps_url: event.google_maps_url || "",
        facebook_url: event.facebook_url || "",
        is_ended: Boolean(event.is_ended),
      });
    }
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(formData, {
      onSuccess: () => {
        router.push("/admin/events");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
          style={{
            borderColor: `${higColors.blue} transparent ${higColors.blue} ${higColors.blue}`,
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p style={{ color: higColors.red, fontSize: "17px" }}>
          {error.message}
        </p>
        <Link href="/admin/events">
          <HIGButton className="mt-4">กลับ</HIGButton>
        </Link>
      </div>
    );
  }

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
            แก้ไข Event
          </h1>
          <p style={{ color: higColors.labelSecondary, fontSize: "15px" }}>
            ID: {eventId}
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
                  <HIGLabel htmlFor="description">รายละเอียด</HIGLabel>
                  <HIGTextarea
                    id="description"
                    name="description"
                    value={formData.description}
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

                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ backgroundColor: higColors.bgSecondary }}
                >
                  <input
                    type="checkbox"
                    id="is_ended"
                    name="is_ended"
                    checked={formData.is_ended}
                    onChange={handleChange}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: higColors.blue }}
                  />
                  <HIGLabel htmlFor="is_ended">Event จบแล้ว</HIGLabel>
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
                {updateMutation.error && (
                  <div
                    className="text-sm p-3 rounded-xl"
                    style={{
                      backgroundColor: "rgba(255, 59, 48, 0.1)",
                      color: higColors.red,
                    }}
                  >
                    {updateMutation.error.message}
                  </div>
                )}
                <HIGButton
                  type="submit"
                  className="w-full gap-2"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      บันทึกการแก้ไข
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
