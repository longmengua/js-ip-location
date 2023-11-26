"use client";
import { useState } from "react";

export default function DemoPage() {
  const [testError, setTestError] = useState(false);

  if (testError) throw new Error("test error.tsx");

  return (
    <>
      <button
        onClick={() => {
          setTestError(true);
        }}
      >
        Throw Error
      </button>
    </>
  );
}
