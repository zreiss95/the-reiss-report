import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyCsrfToken } from "@/lib/auth/csrf";


export async function requireAdmin(
  req: NextRequest
) {

  try {

    const supabase =
      await createClient();


    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();


    if (!user) {

      return NextResponse.json(
        {
          success:false,
          error:"Unauthorized",
        },
        {
          status:401,
        }
      );

    }


    const {
      data: profile,
      error,
    } =
      await supabase
        .from("profiles")
        .select("role")
        .eq(
          "id",
          user.id
        )
        .single();



    if (
      error ||
      !profile ||
      profile.role !== "admin"
    ) {

      return NextResponse.json(
        {
          success:false,
          error:"Unauthorized",
        },
        {
          status:401,
        }
      );

    }



    const csrfToken =
      req.headers.get(
        "x-csrf-token"
      );


    const validCsrf =
      await verifyCsrfToken(
        csrfToken
      );


    if (!validCsrf) {

      return NextResponse.json(
        {
          success:false,
          error:"Invalid CSRF token",
        },
        {
          status:403,
        }
      );

    }



    return null;


  } catch (err) {

    console.error(
      "Admin authentication error:",
      err
    );


    return NextResponse.json(
      {
        success:false,
        error:"Unauthorized",
      },
      {
        status:401,
      }
    );

  }

}