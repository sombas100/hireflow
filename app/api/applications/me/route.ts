import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        
        const session = await auth();
        const userId = session?.user.id as string | undefined;
        const role = session?.user.role as string | undefined;
    
        if (!userId)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
        if (role !== "CANDIDATE" && role !== "ADMIN")
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    
        const usersApplications = await prisma.application.findMany({
            where: { id: userId },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                job: { 
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        location: true,
                        jobType: true,
                        workplaceType: true,
                        isRemote: true,
                        isPublished: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                logoUrl: true,
                                location: true,
                            }
                        }
                    }
                }
            }
        })
        
        return NextResponse.json({ data: usersApplications }, { status: 200 })
    } catch (error) {
        console.error('There was an error fetching applications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}