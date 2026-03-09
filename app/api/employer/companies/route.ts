import { CreateCompanySchema } from "@/zod/zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        
        const session = await auth();
        const userId = session?.user.id as string | undefined;
        const role = session?.user.role as string | undefined;
    
        if (!userId)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
        if (role !== "EMPLOYER" && role !== "ADMIN")
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    
        const body = await request.json();
        const validation = CreateCompanySchema.safeParse(body);
        if (!validation.success)
            return NextResponse.json({ 
        error: "Bad request", 
        issues: validation.error.issues }, 
        { status: 400 })
        
        const data = validation.data;
        const newCompany = await prisma.company.create({
            data: {
                name: data.name,
                slug: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl,
                location: data.location,
                owners: {
                    connect: [{ id: userId }]
                }
            },
            include: {
                owners: {
                    select: { id: true, name: true, email: true, role: true }
                }
            }
        })

        return NextResponse.json({ data: newCompany }, { status: 201 })
    } catch (error: any) {
        if (error?.code === "P2002") {
            return NextResponse.json(
                { error: "A company with that slug already exists" },
                { status: 409 }
            );
        }

        console.error("There was an error creating the company: ", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function GET() {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;
    const role = (session?.user as any)?.role as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "EMPLOYER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const companies = await prisma.company.findMany({
      where: {
        owners: {
          some: {
            id: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        owners: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    return NextResponse.json({ data: companies }, { status: 200 });
  } catch (error) {
    console.error("There was an error retrieving the companies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
