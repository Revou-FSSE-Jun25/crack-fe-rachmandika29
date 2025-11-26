import { NextResponse } from "next/server";
import { z } from "zod";
import { signInSchema } from "@/lib/validation/authSchemas";
import users from "@/data/users.json";
type User = { id: number; name: string; email: string; password: string };

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

    const list: User[] = role === "admin" ? (users.admins as User[]) : (users.clients as User[]);
    const found = list.find((u) => u.email.toLowerCase() === parsed.data.email.toLowerCase());
    if (!found || found.password !== parsed.data.password) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }
    const tokenPayload = `${role}:${found.email}`;
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
