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
import { useAdminPlace, useUpdatePlace } from "@/hooks/use-admin-places";
import { PlaceFormData, PlaceImage } from "@/types";
import {
  ArrowLeft,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Tag,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PLACE_TYPES = ["Cafe", "Food", "Restaurant", "Travel", "Bar/Nightlife"];

// Extended form data to include images
interface ExtendedPlaceFormData extends PlaceFormData {
  images?: { image_url: string; caption?: string }[];
}

export default function EditPlacePage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { data: place, isLoading } = useAdminPlace(id);
  const updateMutation = useUpdatePlace(id);

  const [formData, setFormData] = useState<ExtendedPlaceFormData>({
    name: "",
    place_type: "Cafe",
    description: "",
    instagram_url: "",
    latitude: "",
    longitude: "",
    google_maps_url: "",
    cover_image_url: "",
    categories: [],
    images: [],
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");

  // Existing images from database (read-only display)
  const [existingImages, setExistingImages] = useState<PlaceImage[]>([]);

  const [isInitialized, setIsInitialized] = useState(false);

  // Populate form when place data loads
  useEffect(() => {
    if (place && !isInitialized) {
      // Find matching place type (case-insensitive)
      const matchingType = PLACE_TYPES.find(
        (t) => t.toLowerCase() === (place.place_type || "").toLowerCase()
      );

      setFormData({
        name: place.name,
        place_type: matchingType || place.place_type || "Cafe", // Use matching type if found, else original, else default
        description: place.description || "",
        instagram_url: place.instagram_url || "",
        latitude: place.latitude?.toString() || "",
        longitude: place.longitude?.toString() || "",
        google_maps_url: place.google_maps_url || "",
        cover_image_url: place.cover_image_url || "",
        categories: place.category_names || [],
        images: [],
      });
      setExistingImages(place.images || []);
      setIsInitialized(true);
    }
  }, [place, isInitialized]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Category handlers
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

  // Image handlers
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [
          ...(prev.images || []),
          {
            image_url: newImageUrl.trim(),
            caption: newImageCaption.trim() || undefined,
          },
        ],
      }));
      setNewImageUrl("");
      setNewImageCaption("");
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const handleSetCoverImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      cover_image_url: url,
    }));
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(formData, {
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        // Optional: Error handling logic if needed, currently displayed in UI
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <HIGButton
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="cursor-pointer"
        >
          <ArrowLeft size={20} />
        </HIGButton>
        <div>
          <h1
            style={{
              color: higColors.labelPrimary,
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            แก้ไข Place
          </h1>
          <p style={{ color: higColors.labelSecondary, fontSize: "15px" }}>
            {place?.name}
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
                      defaultValue={formData.place_type}
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

            {/* Images Gallery */}
            <HIGCard>
              <HIGCardHeader>
                <HIGCardTitle className="flex items-center gap-2">
                  <ImageIcon size={20} />
                  รูปภาพทั้งหมด
                </HIGCardTitle>
              </HIGCardHeader>
              <HIGCardContent className="space-y-4">
                {/* Cover Image */}
                <div className="space-y-2">
                  <HIGLabel htmlFor="cover_image_url">
                    URL รูปปก (Cover)
                  </HIGLabel>
                  <HIGInput
                    id="cover_image_url"
                    name="cover_image_url"
                    value={formData.cover_image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                  {formData.cover_image_url && (
                    <div
                      className="relative aspect-video rounded-xl overflow-hidden max-w-md"
                      style={{ backgroundColor: higColors.bgSecondary }}
                    >
                      <img
                        src={formData.cover_image_url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <span
                        className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-lg"
                        style={{ backgroundColor: higColors.blue }}
                      >
                        รูปปก
                      </span>
                    </div>
                  )}
                </div>

                {/* Existing Images from Database */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <HIGLabel>
                      รูปภาพที่มีอยู่ ({existingImages.length} รูป)
                    </HIGLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {existingImages.map((img) => (
                        <div
                          key={img.id}
                          className="relative aspect-square rounded-xl overflow-hidden group"
                          style={{ backgroundColor: higColors.bgSecondary }}
                        >
                          <img
                            src={img.image_url}
                            alt={img.caption || "Place image"}
                            className="w-full h-full object-cover"
                          />
                          {img.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                              {img.caption}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(img.image_url)}
                            className="absolute top-1 right-1 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            style={{ backgroundColor: higColors.blue }}
                          >
                            ตั้งเป็นปก
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Image */}
                <div
                  className="space-y-2 pt-4"
                  style={{ borderTop: `0.5px solid ${higColors.separator}` }}
                >
                  <HIGLabel>เพิ่มรูปใหม่</HIGLabel>
                  <div className="flex gap-2">
                    <HIGInput
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="URL รูปภาพ"
                      className="flex-1"
                    />
                    <HIGInput
                      value={newImageCaption}
                      onChange={(e) => setNewImageCaption(e.target.value)}
                      placeholder="Caption"
                      className="w-32"
                    />
                    <HIGButton
                      type="button"
                      onClick={handleAddImage}
                      variant="secondary"
                      size="icon"
                    >
                      <Plus size={18} />
                    </HIGButton>
                  </div>

                  {/* New Images Preview */}
                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl overflow-hidden group"
                          style={{ backgroundColor: higColors.bgSecondary }}
                        >
                          <img
                            src={img.image_url}
                            alt={img.caption || "New image"}
                            className="w-full h-full object-cover"
                          />
                          <span
                            className="absolute top-1 left-1 text-white text-xs px-2 py-0.5 rounded-lg"
                            style={{ backgroundColor: higColors.green }}
                          >
                            ใหม่
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            style={{
                              backgroundColor: higColors.red,
                              color: "white",
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </HIGCardContent>
            </HIGCard>

            {/* Location */}
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
            {/* Tags/Categories */}
            <HIGCard>
              <HIGCardHeader>
                <HIGCardTitle className="flex items-center gap-2">
                  <Tag size={20} />
                  Tags / Categories
                </HIGCardTitle>
              </HIGCardHeader>
              <HIGCardContent className="space-y-4">
                <div className="flex gap-2">
                  <HIGInput
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder="เพิ่ม tag..."
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

                {/* Tags Display */}
                <div className="flex flex-wrap gap-2">
                  {formData.categories?.length === 0 && (
                    <p
                      style={{
                        color: higColors.labelSecondary,
                        fontSize: "15px",
                      }}
                    >
                      ยังไม่มี tags
                    </p>
                  )}
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
                        className="hover:opacity-70 rounded-full p-0.5 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick Add Popular Tags */}
                <div
                  className="pt-2"
                  style={{ borderTop: `0.5px solid ${higColors.separator}` }}
                >
                  <p
                    style={{
                      color: higColors.labelSecondary,
                      fontSize: "13px",
                      marginBottom: "8px",
                    }}
                  >
                    Tags ยอดนิยม:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "chiangmaifood",
                      "chiangmaicafe",
                      "cmfood",
                      "cmcafe",
                      "lannafood",
                      "hiddenplace",
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (!formData.categories?.includes(tag)) {
                            setFormData((prev) => ({
                              ...prev,
                              categories: [...(prev.categories || []), tag],
                            }));
                          }
                        }}
                        disabled={formData.categories?.includes(tag)}
                        className="text-xs px-2 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: higColors.bgSecondary,
                          color: higColors.labelPrimary,
                        }}
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </HIGCardContent>
            </HIGCard>

            {/* Links */}
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
                <HIGButton
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBack}
                >
                  ยกเลิก
                </HIGButton>
              </HIGCardContent>
            </HIGCard>
          </div>
        </div>
      </form>
    </div>
  );
}
