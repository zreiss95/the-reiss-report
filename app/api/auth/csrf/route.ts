import { NextResponse } from "next/server";
import { setCsrfToken } from "@/lib/auth/csrf";

export async function GET() {

  await setCsrfToken();

  return NextResponse.json({
    success:true,
  });

}