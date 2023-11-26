"use client";

import { useIpResource } from "@/hooks/useIpResource";
import { useMemo } from "react";

const block = (ipResource: string) => {
  const data = useIpResource(ipResource);
  return (
    <div className="border rounded-md px-5 py-2 flex-1 min-h-[200px]">
      {data}
    </div>
  );
};

const blocks = (ipResources: Array<string>) =>
  useMemo(() => ipResources.map((p) => block(p)), [ipResources]);

export default function IpPage() {
  const ipResources: Array<string> = ["ip138", "maximind", "dpip"];

  return (
    <div className="w-[80%]">
      <div id="search-bar" className="flex w-full">
        <input
          placeholder={"Enter ip"}
          className="border px-3 py-1 outline-none rounded-md flex-1"
        />
        <div className="p-1" />
        <button className="border rounded-md px-3">search</button>
      </div>
      <div className="p-1" />
      <div id="display-blocks" className="flex gap-3">
        {blocks(ipResources)}
      </div>
    </div>
  );
}
