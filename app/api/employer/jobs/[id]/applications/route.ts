import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


type RouteContext = {
    params: Promise<{ jobId: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await auth();
        const userId = session?.user.id as string | undefined;
        const role = session?.user.role as string | undefined;
        
        if (!userId)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            
        if (role !== "EMPLOYER" && role !== "ADMIN")
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { jobId } = await context.params;
        if (!jobId)
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            select: { 
                id: true, 
                title: true, 
                createdById: true,
                company: {
                    select: {
                        id: true,
                        owners: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
             },  
        })

        if (!job)
            return NextResponse.json({ error: "Job not found" }, { status: 404 })

        if (role !== "ADMIN") {
            const ownsJobDirectly = job.createdById === userId;
            const ownsCompany = job.company.owners.some((owner) => owner.id === userId);

        if (!ownsJobDirectly && !ownsCompany) {
            return NextResponse.json(
                { error: "You do not have permission to view these applications" },
                { status: 403 }
            );
        }
    }

        const applications = await prisma.application.findMany({
            where: { id: jobId },
            orderBy: { 
                createdAt: 'desc'
            },
            include: {
                user: { 
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        candidateProfile: {
                            select: {
                                headline: true,
                                location: true,
                                resumeUrl: true,
                                githubUrl: true,
                                linkedinUrl: true,
                            }
                        }
                    }
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            }
                        }
                    }
                }
            },
        })

        return NextResponse.json({ data: applications }, { status: 200 })
    } catch (error) {
        console.error("There was an error retrieving the applications:", error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}