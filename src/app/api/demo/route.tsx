import { NextResponse } from "next/server";

export const GET = async (equest: Request) => {
  return NextResponse.json({
    msg: "Johnny Good Good",
  });
};
