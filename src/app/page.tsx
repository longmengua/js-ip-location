"use client";
import { useRouter } from "next/navigation";

import { Common } from "@/util/common";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    Common.sleep(200).then(() => {
      router.push("/ip");
    });
    return () => {};
  }, []);

  return <div>Loading...</div>;
}
