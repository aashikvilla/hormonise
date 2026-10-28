import { Suspense } from "react";
import DemoRoute from "@/components/demo-route";

export default function DemoPage() {
  return <Suspense fallback={<main className="app-shell"><p className="page-kicker">HARMONISE · CONCEPT DEMO</p><h1>Opening the guided demo…</h1></main>}><DemoRoute /></Suspense>;
}
