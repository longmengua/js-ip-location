import { IP138 } from "@/util/ip/ip138";
import { Maxmind } from "@/util/ip/maxmind";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const ip = request.nextUrl.searchParams.get("ip");
  await IP138.loadIpResource();
  await Maxmind.loadIpResource();

  // with ip param
  if (!ip) {
    return NextResponse.json({
      data: undefined,
      msg: "missing param: ip",
    });
  }

  const resIp138 = IP138.findByIp(ip);
  const resMaxmind = Maxmind.findByIp(ip);

  const data = {
    ip138: resIp138,
    maxmind: resMaxmind,
  };

  return NextResponse.json({
    data,
    msg: "",
  });
};
