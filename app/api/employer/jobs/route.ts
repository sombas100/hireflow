import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { CreateJobSchema } from "@/zod/zod";

export async function POST(request: NextRequest){
    try {
        const session = await auth();
        const userId = session?.user.id as string | undefined;
        const role = session?.user.role as string | undefined;

        if (!userId)
            return NextResponse.json({ error: 'Unauthorized'}, { status: 403 })

        if (role !== "ADMIN" && role !== "EMPLOYER") {
            return NextResponse.json({ error: 'Forbidden' }, { status: 401 })
        }

        const body = await request.json();
        const validation = CreateJobSchema.safeParse(body);
        if (!validation.success)
            return NextResponse.json({ error: 'Bad request', issues: validation.error.issues }, { status: 400 })

        const data = validation.data;

        if (role !== "ADMIN") {
            const company = await prisma.company.findFirst({
                where: { 
                    id: data.companyId,
                    owners: { some: { id: userId } } 
                },
                select: { id: true }
            })
            if (!company) {
                return NextResponse.json(
                    { error: 'You do not own this company'},
                     { status: 403 })
            }
        }

        const job = await prisma.job.create({
            data: {
                companyId: data.companyId,
                createdById: userId,
                title: data.title,
                slug: data.slug,
                description: data.description,
                jobType: data.jobType,
                workplaceType: data.workplaceType,
                location: data.location,
                isRemote: data.isRemote,
                isPublished: data.isPublished,
                publishedAt: data.isPublished ? new Date : null,
                tags: data.tagIds.length
                ? {
                    create: data.tagIds.map((tagId) => ({
                    tag: { connect: { id: tagId } },
                    })),
                }   
                : undefined,
            },
            include: {
                company: true,
                tags: { include: { tag: true }}
            },
        });

        return NextResponse.json(
            {
                data: {
                ...job,
                tags: job.tags.map((t) => t.tag),
                },
            },
      { status: 201 }
    );
        
    } catch (error: any) {
        if (error?.code === "P2002") {
            return NextResponse.json(
                { error: "A company with that slug already exists" },
                { status: 409 }
            );
        }
        console.error(error);
        return NextResponse.json({ error: 'Internal server error '}, { status: 500 })
    }


}