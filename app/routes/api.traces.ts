import { sampleSpans } from "~/lib/trace-data";
import type { Route } from "./+types/api.traces";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const traceId = url.searchParams.get("trace");
  const spans = traceId ? sampleSpans.filter((span) => span.traceId === traceId) : sampleSpans;
  return new Response(JSON.stringify({ mode: "sample", generatedAt: "2026-08-31T09:43:00Z", spans }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="agent-traces-sample.json"`,
      "cache-control": "no-store",
    },
  });
}
