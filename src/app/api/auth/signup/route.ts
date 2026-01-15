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
    const upstreamToken =
      (typeof upstreamJson?.token === "string" && upstreamJson.token) ||
      (typeof upstreamJson?.accessToken === "string" && upstreamJson.accessToken) ||
      (typeof upstreamJson?.access_token === "string" && upstreamJson.access_token) ||
      (typeof upstreamJson?.jwt === "string" && upstreamJson.jwt) ||
      (typeof upstreamJson?.data?.token === "string" && upstreamJson.data.token) ||
      null;
    if (upstreamToken) {
      res.cookies.set("upstream_bearer", upstreamToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 30, // 30 minutes
      });
    }
    const setCookieHeader =
      upstream.headers.get("set-cookie") ||
      upstream.headers.get("Set-Cookie") ||
      null;
    if (setCookieHeader) {
      const match = setCookieHeader.match(/^\s*([^=;,\s]+=[^;]+)/);
      const nv = match ? match[1] : null;
      if (nv) {
        res.cookies.set("upstream_cookie", nv, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 30, // 30 minutes
        });
      }
    }
    return res;
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
