"use client";

import {
  HIGButton,
  HIGCard,
  HIGCardContent,
  HIGCardHeader,
  HIGCardTitle,
  higColors,
  HIGInput,
  HIGLabel,
  HIGSelect,
  HIGSelectContent,
  HIGSelectItem,
  HIGSelectTrigger,
  HIGSelectValue,
  HIGTextarea,
} from "@/components/ui/hig-components";
import { useCreatePlace } from "@/hooks/use-admin-places";
import { PlaceFormData } from "@/types";
import { ArrowLeft, Loader2, Plus, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLACE_TYPES = ["Cafe", "Food", "Restaurant", "Travel", "Bar/Nightlife"];

export default function NewPlacePage() {
  const router = useRouter();
  const createMutation = useCreatePlace();

  const [formData, setFormData] = useState<PlaceFormData>({
    name: "",
    place_type: "Cafe",
    description: "",
    instagram_url: "",
    latitude: "",
    longitude: "",
    google_maps_url: "",
    cover_image_url: "",
    categories: [],
  });

  const [categoryInput, setCategoryInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (
      categoryInput.trim() &&
      !formData.categories?.includes(categoryInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), categoryInput.trim()],
      }));
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories?.filter((c) => c !== cat),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: () => {
        router.push("/admin/places");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/places">
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
            เพิ่ม Place ใหม่
          </h1>
          <p style={{ color: higColors.labelSecondary, fontSize: "15px" }}>
            กรอกข้อมูล Place ที่ต้องการเพิ่ม
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <HIGLabel htmlFor="name">ชื่อ Place *</HIGLabel>
                    <HIGInput
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="ชื่อร้าน/สถานที่"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <HIGLabel htmlFor="place_type">ประเภท *</HIGLabel>
                    <HIGSelect
                      value={formData.place_type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, place_type: value }))
                      }
                    >
                      <HIGSelectTrigger>
                        <HIGSelectValue placeholder="เลือกประเภท" />
                      </HIGSelectTrigger>
                      <HIGSelectContent>
                        {PLACE_TYPES.map((type) => (
                          <HIGSelectItem key={type} value={type}>
                            {type}
                          </HIGSelectItem>
                        ))}
                      </HIGSelectContent>
                    </HIGSelect>
                  </div>
                </div>

                <div className="space-y-2">
                  <HIGLabel htmlFor="description">รายละเอียด</HIGLabel>
                  <HIGTextarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="รายละเอียดร้าน/สถานที่"
                  />
                </div>
              </HIGCardContent>
            </HIGCard>

            <HIGCard>
              <HIGCardHeader>
                <HIGCardTitle>สถานที่</HIGCardTitle>
              </HIGCardHeader>
              <HIGCardContent className="space-y-4">
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
                  <HIGLabel htmlFor="instagram_url">Instagram URL</HIGLabel>
                  <HIGInput
                    id="instagram_url"
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </HIGCardContent>
            </HIGCard>

            <HIGCard>
              <HIGCardHeader>
                <HIGCardTitle>Categories</HIGCardTitle>
              </HIGCardHeader>
              <HIGCardContent className="space-y-4">
                <div className="flex gap-2">
                  <HIGInput
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder="เพิ่ม category"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <HIGButton
                    type="button"
                    onClick={handleAddCategory}
                    variant="secondary"
                    size="icon"
                  >
                    <Plus size={18} />
                  </HIGButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.categories?.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${higColors.blue}15`,
                        color: higColors.blue,
                      }}
                    >
                      #{cat}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat)}
                        className="hover:opacity-70 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
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
                      บันทึก Place
                    </>
                  )}
                </HIGButton>
                <Link href="/admin/places" className="block">
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
