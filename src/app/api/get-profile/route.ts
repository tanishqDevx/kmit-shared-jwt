import { NextResponse } from "next/server";
import axios from "axios";
import { getJWT } from "../../lib/jwtStore";
import { usersMap } from "../../lib/usersMap";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const number = url.searchParams.get("number");
  const jwt = getJWT();

  if (!jwt)
    return NextResponse.json(
      { error: "JWT expired. Refresh required." },
      { status: 401 }
    );
  if (!number)
    return NextResponse.json({ error: "Number required" }, { status: 400 });

  const studentId = usersMap[number];
  if (!studentId)
    return NextResponse.json({ error: "Student not found" }, { status: 404 });

  try {
    const response = await axios.get(
      `https://kmit-api.teleuniv.in/studentmaster/studentprofile/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
          Origin: "https://kmit.teleuniv.in",
          Referer: "https://kmit.teleuniv.in/",
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
