import { NextResponse } from "next/server";
import { z } from "zod";

// Server-side signup payload (confirm handled client-side)
const serverSignUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = serverSignUpSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message || "Invalid data";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }

    // In a real app, create the user record here.
    // Auto-login the user after sign up by issuing an auth cookie.
    const tokenPayload = `user:${parsed.data.email}`;
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