import { UpdateApplicationSchema } from "@/zod/zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{ applicationId: string }>
}


export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        
        const session = await auth();
        const userId = session?.user.id as string | undefined;
        const role = session?.user.role as string | undefined;
    
        if (!userId)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
        if (role !== "EMPLOYER" && role !== "ADMIN") 
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    
        const { applicationId } = await context.params;
        if (!applicationId)
            return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 })
    
        const body = await request.json();
        const validation = UpdateApplicationSchema.safeParse(body);
        if (!validation.success)
            return NextResponse.json({ error: 'Bad request', issues: validation.error.issues }, { status: 400 });
    
        const { status } = validation.data;
    
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: {
                id: true,
                status: true,
                job: {
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
                                    }
                                }
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })
    
        if (!application)
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    
        if (role !== 'ADMIN') {
            const ownsJobDirectly = application.job.createdById === userId;
            const ownsCompany = application.job.company.owners.some(
                (owner) => owner.id === userId
            );
            if (!ownsJobDirectly && !ownsCompany) {
                return NextResponse.json(
                    { error: 'You do not have permission to update this application' },
                    { status: 403 }
                );
            }
        }
    
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: {
                status,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        candidateProfile: {
                            select: {
                                headline: true,
                                location: true,
                                resumeUrl: true,
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
            }
        })
    
        return NextResponse.json({ data: updatedApplication }, { status: 200 })
    } catch (error) {
        console.error("There was an error updating the application:", error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}