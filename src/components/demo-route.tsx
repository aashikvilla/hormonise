"use client";

import { useSearchParams } from "next/navigation";
import DemoExperience from "@/components/demo-experience";
import type { EntryPath } from "@/lib/harmonise";

const validPaths: Exclude<EntryPath, null>[] = ["talk", "unsure", "quiet", "support"];

export default function DemoRoute() {
  const params = useSearchParams();
  const requestedPath = params.get("path");
  const requestedExample = params.get("example");
  const requestedScenario = params.get("scenario");
  const requestedHelp = params.get("help");
  const initialPath = requestedHelp === "safety"
    ? "help"
    : requestedExample === "arjun" || requestedScenario === "arjun"
      ? "arjun"
      : validPaths.includes(requestedPath as Exclude<EntryPath, null>)
        ? requestedPath as Exclude<EntryPath, null>
        : undefined;

  return <DemoExperience initialPath={initialPath} />;
}
