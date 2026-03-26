import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { UpdateCandidateProfileSchema } from '@/zod/zod';

export async function GET() {
    try {
        const session = await auth();
        const userId = session?.user.id as string | undefined;
        const role = session?.user.role as string | undefined;

        if (!userId)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (role !== "CANDIDATE" && role !== "ADMIN") 
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const profile = await prisma.candidateProfile.findUnique({
            where: { id: userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    }
                }
            }
        })

        return NextResponse.json({ data: profile }, { status: 200 })
    } catch (error) {
        console.error("There was an error retrieving the profile:", error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        
        const session = await auth();
        const userId = session?.user.id as string | undefined;
        const role = session?.user.role as string | undefined;
    
        if (!userId)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
        if (role !== "CANDIDATE" && role !== "ADMIN") 
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    
        const body = await request.json();
        const validation = UpdateCandidateProfileSchema.safeParse(body)
        if (!validation.success)
            return NextResponse.json({ error: "Bad request", issues: validation.error.issues }, { status: 400 })
    
        const data = validation.data;
    
        if (Object.keys(data).length === 0) {
          return NextResponse.json(
            { error: "No fields provided for update" },
            { status: 400 }
          );
        }
    
        const cleanedData = {
          headline: data.headline,
          bio: data.bio,
          location: data.location,
          websiteUrl: data.websiteUrl === "" ? null : data.websiteUrl,
          githubUrl: data.githubUrl === "" ? null : data.githubUrl,
          linkedinUrl: data.linkedinUrl === "" ? null : data.linkedinUrl,
          resumeUrl: data.resumeUrl === "" ? null : data.resumeUrl,
          resumeName: data.resumeName,
        };
    
        const existingProfile = await prisma.candidateProfile.findUnique({
          where: {
            userId,
          },
          select: {
            id: true,
          },
        });
    
        const profile = existingProfile
          ? await prisma.candidateProfile.update({
              where: {
                userId,
              },
              data: cleanedData,
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                  },
                },
              },
            })
          : await prisma.candidateProfile.create({
              data: {
                userId,
                ...cleanedData,
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                  },
                },
              },
            });
    
        return NextResponse.json({ data: profile }, { status: 200 });
    } catch (error) {
        console.error('There was an issue updating the profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}