import { IP138 } from "@/util/ip/ip138";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  await IP138.loadIpResource();

  // with no query param
  const data = IP138.findAll();
  return NextResponse.json({
    data,
  });
};
