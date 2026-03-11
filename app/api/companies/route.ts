import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") || "";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

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

    const totalCompanies = await prisma.company.count({ where });

    const companies = await prisma.company.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: companies,
        pagination: {
          page,
          limit,
          total: totalCompanies,
          totalPages: Math.ceil(totalCompanies / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get public companies list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}