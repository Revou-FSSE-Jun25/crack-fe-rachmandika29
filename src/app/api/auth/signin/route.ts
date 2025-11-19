import { NextResponse } from "next/server";
import { z } from "zod";
import { signInSchema } from "@/lib/validation/authSchemas";

const roleSchema = z.object({ role: z.enum(["user", "admin"]).optional() });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Invalid credentials";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }

    const roleParsed = roleSchema.safeParse(body);
    const role = roleParsed.success && roleParsed.data.role ? roleParsed.data.role : "user";

    
    // For now, accept any valid payload and issue an auth cookie.
    const tokenPayload = `${role}:${parsed.data.email}`;
    const token = Buffer.from(tokenPayload).toString("base64");

    const res = NextResponse.json({ ok: true });
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return res;
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}