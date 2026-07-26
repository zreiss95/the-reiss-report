import { NextRequest, NextResponse } from "next/server";


export function middleware(
  req: NextRequest
) {

  const path =
    req.nextUrl.pathname;


  if (
    path.startsWith("/admin/login")
  ) {
    return NextResponse.next();
  }


  if (
    path.startsWith("/admin")
  ) {

    const session =
      req.cookies.get("admin-auth")
        ?.value;


    if (!session) {

      return NextResponse.redirect(
        new URL(
          "/admin/login",
          req.url
        )
      );

    }

  }


  return NextResponse.next();

}


export const config = {
  matcher: [
    "/admin/:path*",
  ],
};