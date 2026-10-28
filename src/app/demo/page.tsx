import DemoExperience from "@/components/demo-experience";
import type { EntryPath } from "@/lib/harmonise";

type PageProps = {
  searchParams: Promise<{ path?: string | string[]; example?: string | string[]; help?: string | string[] }>;
};

const validPaths: Exclude<EntryPath, null>[] = ["talk", "unsure", "quiet", "support"];

export default async function DemoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedPath = Array.isArray(params.path) ? params.path[0] : params.path;
  const requestedExample = Array.isArray(params.example) ? params.example[0] : params.example;
  const requestedHelp = Array.isArray(params.help) ? params.help[0] : params.help;
  const initialPath = requestedHelp === "safety" ? "help" : requestedExample === "arjun" ? "arjun" : validPaths.includes(requestedPath as Exclude<EntryPath, null>) ? requestedPath as Exclude<EntryPath, null> : undefined;
  return <DemoExperience initialPath={initialPath} />;
}
