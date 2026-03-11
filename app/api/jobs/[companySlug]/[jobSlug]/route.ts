import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{ companySlug: string, jobSlug: string }>
}

export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        const { companySlug, jobSlug } = await context.params;

        if (!companySlug || !jobSlug) 
            return NextResponse.json({ error: 'Company slug and job slug are required' }, { status: 400 })

        const job = await prisma.job.findFirst({
            where: { slug: jobSlug, isPublished: true, company: { slug: companySlug } },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        websiteUrl: true,
                        logoUrl: true,
                        location: true,
                    }
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        applications: true,
                        bookmarks: true,
                    }
                }
            }  
        })
        if (!job)
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })

        return NextResponse.json(
            { 
                data: { ...job,  tags: job.tags.map((item) => item.tag)},
             }, { status: 200 })
    } catch (error) {
        console.error('There was an error retrieving the job details:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}