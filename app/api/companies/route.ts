import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import type { CachedCompaniesResponse } from "@/lib/cache-types";


function buildCompaniesCacheKey(params: {
  q: string;
  page: number;
  limit: number;
}) {
  return [
    "companies",
    `q=${params.q}`,
    `page=${params.page}`,
    `limit=${params.limit}`,
  ].join(":");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") || "";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = Number.isNaN(limit) || limit < 1 ? 10 : limit;

    const skip = (safePage - 1) * safeLimit;

    const cacheKey = buildCompaniesCacheKey({
      q,
      page: safePage,
      limit: safeLimit,
    });

    const cached = await redis.get<CachedCompaniesResponse>(cacheKey);

    if (cached) {
      return NextResponse.json(cached, { status: 200 });
    }

    const where = q
      ? {
          OR: [
            {
              name: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              location: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [totalCompanies, companies] = await Promise.all([
      prisma.company.count({ where }),
      prisma.company.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: safeLimit,
        include: {
          _count: {
            select: {
              jobs: true,
            },
          },
        },
      }),
    ]);

    const response: CachedCompaniesResponse = {
      data: companies,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: totalCompanies,
        totalPages: Math.ceil(totalCompanies / safeLimit),
      },
    };

    await redis.set(cacheKey, response, {
      ex: 120,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get public companies list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}