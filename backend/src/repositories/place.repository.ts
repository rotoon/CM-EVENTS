/**
 * Place Repository
 * Database queries สำหรับ Places
 */

import prisma from "../lib/prisma";
import type {
  PlaceFilters,
  PlacePaginationResult,
  PlaceWithCategories,
} from "../types/place.interface";

/**
 * Categories ที่ต้องการ exclude ออกจากผลลัพธ์
 * - ต่างประเทศ (japan, korea, taiwan)
 * - จังหวัดอื่น (surat)
 */
const EXCLUDED_CATEGORIES = [
  // ต่างประเทศ
  "japan",
  "japancafe",
  "japanrecommend",
  "japankyoto",
  "japantravel",
  "korea",
  "koreatravel",
  "korearecommend",
  "koreafood",
  "koreadessert",
  "taiwan",
  "taiwancafe",
  "taiwanrecommend",
  "taiwantravel",
  // จังหวัดอื่น (ไม่ใช่เชียงใหม่)
  "surat",
  "suratfood",
  "suratcafe",
  "surattravel",
  "suratrecommend",
];

export const placeRepository = {
  /**
   * ดึงรายการ places พร้อม pagination และ filters
   * Auto-exclude places ที่มี categories ต่างประเทศหรือจังหวัดอื่น
   */
  async findMany(filters: PlaceFilters): Promise<PlacePaginationResult> {
    const { place_type, category, search, limit = 20, offset = 0 } = filters;

    // สร้าง where conditions
    const where: Record<string, unknown> = {
      // Exclude places ที่มี categories ที่ไม่ต้องการ
      NOT: {
        categories: {
          some: {
            category: { in: EXCLUDED_CATEGORIES },
          },
        },
      },
    };

    if (place_type) {
      where.place_type = place_type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      // Support comma-separated categories for multi-select
      const categoryList = category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (categoryList.length === 1) {
        where.categories = {
          some: { category: categoryList[0] },
        };
      } else if (categoryList.length > 1) {
        // OR logic: match places that have ANY of the selected categories
        where.categories = {
          some: { category: { in: categoryList } },
        };
      }
    }

    // นับจำนวนทั้งหมด
    const total = await prisma.places.count({ where });

    // ดึงข้อมูล
    const places = await prisma.places.findMany({
      where,
      include: {
        categories: true,
      },
      orderBy: [{ post_date: "desc" }, { likes: "desc" }],
      take: limit,
      skip: offset,
    });

    // แปลงเป็น PlaceWithCategories
    const data: PlaceWithCategories[] = places.map((place) => ({
      ...place,
      category_names: place.categories.map((c) => c.category),
    }));

    return {
      data,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  },

  /**
   * ดึง place ตาม ID
   */
  async findById(id: number): Promise<PlaceWithCategories | null> {
    const place = await prisma.places.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!place) return null;

    return {
      ...place,
      category_names: place.categories.map((c) => c.category),
    };
  },

  /**
   * ดึง categories ทั้งหมดพร้อมจำนวน (exclude categories ต่างประเทศ/จังหวัดอื่น)
   * @param place_type - (optional) filter categories เฉพาะ place_type นี้
   */
  async getCategories(
    place_type?: string
  ): Promise<{ category: string; count: number }[]> {
    // สร้าง where conditions
    const where: Record<string, unknown> = {
      category: { notIn: EXCLUDED_CATEGORIES },
    };

    // ถ้ามี place_type ให้ filter เฉพาะ categories ของ place_type นั้น
    if (place_type) {
      where.place = { place_type };
    }

    const categories = await prisma.place_categories.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
      where,
    });

    return categories.map((c) => ({
      category: c.category,
      count: c._count.category,
    }));
  },

  /**
   * ดึง place types พร้อมจำนวน (exclude places ที่มี categories ต่างประเทศ/จังหวัดอื่น)
   */
  async getPlaceTypes(): Promise<{ place_type: string; count: number }[]> {
    const types = await prisma.places.groupBy({
      by: ["place_type"],
      _count: { place_type: true },
      orderBy: { _count: { place_type: "desc" } },
      where: {
        NOT: {
          categories: {
            some: { category: { in: EXCLUDED_CATEGORIES } },
          },
        },
      },
    });

    return types.map((t) => ({
      place_type: t.place_type,
      count: t._count.place_type,
    }));
  },

  /**
   * ค้นหา places
   */
  async search(query: string, limit = 10): Promise<PlaceWithCategories[]> {
    const places = await prisma.places.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          {
            NOT: {
              categories: {
                some: { category: { in: EXCLUDED_CATEGORIES } },
              },
            },
          },
        ],
      },
      include: {
        categories: true,
      },
      orderBy: { likes: "desc" },
      take: limit,
    });

    return places.map((place) => ({
      ...place,
      category_names: place.categories.map((c) => c.category),
    }));
  },
};
