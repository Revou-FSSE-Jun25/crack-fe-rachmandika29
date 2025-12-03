import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : null;
    const dateIso = typeof body?.dateIso === "string" ? body.dateIso : null;
    const time = typeof body?.time === "string" ? body.time : null;
    if (!id || !dateIso || !time) return NextResponse.json({ ok: false, error: "Invalid data" }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

