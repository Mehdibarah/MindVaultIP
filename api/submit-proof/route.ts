// app/api/submit-proof/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // TODO: اعتبارسنجی داده‌ها
    if (!body?.txHash) {
      return NextResponse.json({ error: "txHash required" }, { status: 400 });
    }

    // TODO: اینجا لاجیکت را بگذار (ثبت در Supabase/Storage/…)
    // مثال:
    // const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
    // await supabase.from('proofs').insert({ ...body });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// برای CORS ساده (اختیاری)
export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
