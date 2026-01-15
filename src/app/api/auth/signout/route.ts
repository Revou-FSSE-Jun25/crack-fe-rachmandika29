import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function POST() {
  try {
    await fetch(`${API_BASE}/auth/signout`, { method: "POST" });
  } catch {}
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("auth_token");
  res.cookies.delete("upstream_bearer");
  res.cookies.delete("upstream_cookie");
  return res;
}
