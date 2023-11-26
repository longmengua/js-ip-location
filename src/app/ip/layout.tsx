import { Suspense } from "react";

export default function IpPageLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full h-full flex justify-center pt-10">
      {children}
    </section>
  );
}
