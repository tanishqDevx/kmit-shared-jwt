import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import { getJWT } from "../../lib/jwtStore";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const number = url.searchParams.get("number");
  const jwt = getJWT();

  if (!jwt)
    return NextResponse.json(
      { error: "JWT expired. Refresh required." },
      { status: 401 }
    );

  const userFile = fs.readFileSync("users.txt", "utf-8");
  const lines = userFile.split("\n");
  let studentId: string | null = null;

  for (const line of lines) {
    const [num, id] = line.trim().split(":");
    if (num === number) studentId = id;
  }

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
