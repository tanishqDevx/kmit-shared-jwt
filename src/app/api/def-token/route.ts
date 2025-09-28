import { NextResponse } from "next/server";
import axios from "axios";
import { setJWT } from "../../lib/jwtStore";

export async function POST(req: Request) {
  const { captcha } = await req.json();
  const username = "9133533320";
  const password = "Kmit123$";

  try {
    const authResp = await axios.post(
      "https://kmit-api.teleuniv.in/auth/login",
      { username, password, token: captcha, application: "netra" },
      { headers: { "Content-Type": "application/json" } }
    );

    setJWT(authResp.data.access_token);
    return NextResponse.json({
      success: true,
      token: authResp.data.access_token,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
