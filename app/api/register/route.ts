import { NextResponse, NextRequest } from "next/server";
import { RegisterSchema } from "@/zod/zod";
import  bcrypt from 'bcryptjs'
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        
        const body = await request.json();
        const validation = RegisterSchema.safeParse(body);
        if (!validation.success)
            return NextResponse.json(
        { error: 'Bad request', issues: validation.error.issues },
        { status: 400 }
    )
    
        const { name, email, password, role } = validation.data;
        
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true }
        })
        if (existingUser)
            return NextResponse.json({ error: 'This email is already in use' }, { status: 409 })
    
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                passwordHash,
                role
            },
            select: { id: true, name: true, email: true, role: true }
        })
    
        return NextResponse.json({ data: user }, { status: 201 })
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}