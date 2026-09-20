import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { setCsrfToken } from "@/lib/auth/csrf";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const token = await setCsrfToken();
  return NextResponse.json({ success: true, token });
}
