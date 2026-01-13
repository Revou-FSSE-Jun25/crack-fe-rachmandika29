import { NextResponse } from "next/server";
import { z } from "zod";
import { signInSchema } from "@/lib/validation/authSchemas";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

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

    const upstream = await fetch(`${API_BASE}/auth/signin`, {
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
      const errMsg = upstreamJson?.error || upstreamJson?.message || "Invalid credentials";
      return NextResponse.json({ ok: false, error: errMsg }, { status: upstream.status || 401 });
    }

    const tokenPayload = `${role}:${parsed.data.email}`;
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
    return res;
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
