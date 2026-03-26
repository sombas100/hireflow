import { NextRequest, NextResponse } from "next/server";

const allowedRoles = ["CANDIDATE", "EMPLOYER"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const role = body?.role;

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const response = NextResponse.json(
      { message: "Role selected successfully" },
      { status: 200 }
    );

    response.cookies.set("selected_role", role, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    });

    return response;
  } catch (error) {
    console.error("Select role error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}