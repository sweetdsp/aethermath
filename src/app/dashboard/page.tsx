import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = { title: "Dashboard · AetherMath" };

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <DashboardView />
    </>
  );
}
