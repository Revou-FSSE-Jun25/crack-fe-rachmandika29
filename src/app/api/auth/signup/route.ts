import { NextResponse } from "next/server";
import { z } from "zod";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

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
      const msg = parsed.error.issues[0]?.message || "Invalid data";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }

    const upstream = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
    });
    let upstreamJson: any = null;
    try {
      upstreamJson = await upstream.json();
    } catch {
      upstreamJson = null;
    }
    if (!upstream.ok || (upstreamJson && upstreamJson.ok === false)) {
      const errMsg = upstreamJson?.error || upstreamJson?.message || "Signup failed";
      return NextResponse.json({ ok: false, error: errMsg }, { status: upstream.status || 400 });
    }

    const tokenPayload = `user:${parsed.data.email}`;
    const token = Buffer.from(tokenPayload).toString("base64");

    const res = NextResponse.json(upstreamJson ?? { ok: true });
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
