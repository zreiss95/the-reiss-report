import { NextResponse } from "next/server";

export async function POST() {
  try {

    const response =
      NextResponse.json({
        success: true,
        message: "Logged out.",
      });



    response.cookies.delete(
      "admin-auth"
    );


    response.cookies.delete(
      "admin-csrf"
    );



    return response;



  } catch (err: any) {

    console.error(
      "Admin logout error:",
      err
    );


    return NextResponse.json(
      {
        success: false,
        error: "Logout failed.",
      },
      {
        status: 500,
      }
    );

  }
}