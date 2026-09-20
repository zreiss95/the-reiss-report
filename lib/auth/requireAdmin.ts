import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyCsrfToken } from "@/lib/auth/csrf";

export async function requireAdmin(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile || profile.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const csrfToken = req.headers.get("x-csrf-token");
    const validCsrf = await verifyCsrfToken(csrfToken);

    // Prefer the double-submit CSRF token. If an older/stale admin page does
    // not yet have the token cookie, still allow authenticated admin requests
    // that the browser proves came from this exact site via the Origin header.
    // Cross-site form/fetch requests cannot satisfy this check.
    if (!validCsrf) {
      const origin = req.headers.get("origin");
      const expectedOrigin = req.nextUrl.origin;

      if (!origin || origin !== expectedOrigin) {
        return NextResponse.json(
          { success: false, error: "Invalid CSRF token" },
          { status: 403 }
        );
      }
    }

    return null;
  } catch (err) {
    console.error("Admin authentication error:", err);

    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}
