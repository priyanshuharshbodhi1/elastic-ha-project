import { getPrismaClient } from "@/lib/database";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const prisma = getPrismaClient();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const compare = await bcrypt.compare(password, user.password!);
    if (compare) {
      return NextResponse.json({ success: true, message: "Successfully logged in", data: user }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
