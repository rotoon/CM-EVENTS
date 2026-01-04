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

export const placeRepository = {
  /**
   * ดึงรายการ places พร้อม pagination และ filters
   */
  async findMany(filters: PlaceFilters): Promise<PlacePaginationResult> {
    const { place_type, category, search, limit = 20, offset = 0 } = filters;

    // สร้าง where conditions
    const where: Record<string, unknown> = {};

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
      where.categories = {
        some: { category: category },
      };
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
   * ดึง categories ทั้งหมดพร้อมจำนวน
   */
  async getCategories(): Promise<{ category: string; count: number }[]> {
    const categories = await prisma.place_categories.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });

    return categories.map((c) => ({
      category: c.category,
      count: c._count.category,
    }));
  },

  /**
   * ดึง place types พร้อมจำนวน
   */
  async getPlaceTypes(): Promise<{ place_type: string; count: number }[]> {
    const types = await prisma.places.groupBy({
      by: ["place_type"],
      _count: { place_type: true },
      orderBy: { _count: { place_type: "desc" } },
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
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
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
