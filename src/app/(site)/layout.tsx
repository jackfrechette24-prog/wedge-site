import type { ReactNode } from "react";
import { ClientRuntime } from "@/components/ClientRuntime";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Tracking } from "@/components/Tracking";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ClientRuntime />
      <Tracking />
    </>
  );
}
