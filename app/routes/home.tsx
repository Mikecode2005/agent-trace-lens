import { Form, useLoaderData } from "react-router";
import type { ReactNode } from "react";
import Activity from "lucide-react/dist/esm/icons/activity.js";
import AlertTriangle from "lucide-react/dist/esm/icons/triangle-alert.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/circle-check.js";
import Clock3 from "lucide-react/dist/esm/icons/clock-3.js";
import Download from "lucide-react/dist/esm/icons/download.js";
import Eye from "lucide-react/dist/esm/icons/eye.js";
import Filter from "lucide-react/dist/esm/icons/list-filter.js";
import Gauge from "lucide-react/dist/esm/icons/gauge.js";
import Search from "lucide-react/dist/esm/icons/search.js";
import Sparkles from "lucide-react/dist/esm/icons/sparkles.js";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/components/ui/chart";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import type { Route } from "./+types/home";

type SpanStatus = "ok" | "error" | "running";
type TraceSpan = {
  id: string;
  traceId: string;
  name: string;
  service: string;
  kind: string;
  status: SpanStatus;
  duration: number;
  start: string;
  tokens: number;
  cost: number;
  detail: string;
};

// Deliberately labeled sample data: the dashboard is ready for OTLP ingestion, but no live source is connected yet.
const sampleSpans: TraceSpan[] = [
  { id: "sp_01", traceId: "tr_7f91", name: "customer_support_agent", service: "support-agent", kind: "agent", status: "ok", duration: 1840, start: "09:42:18.104", tokens: 2840, cost: 0.018, detail: "Classified request and selected search_documents" },
  { id: "sp_02", traceId: "tr_7f91", name: "search_documents", service: "mcp-server", kind: "tool", status: "ok", duration: 312, start: "09:42:19.021", tokens: 0, cost: 0, detail: "Returned 4 matching knowledge-base documents" },
  { id: "sp_03", traceId: "tr_b8c2", name: "invoice_reconciliation", service: "finance-agent", kind: "agent", status: "error", duration: 2680, start: "09:41:52.840", tokens: 4210, cost: 0.027, detail: "Tool timeout after 3 retries" },
  { id: "sp_04", traceId: "tr_b8c2", name: "fetch_invoice", service: "erp-mcp", kind: "tool", status: "error", duration: 2510, start: "09:41:53.010", tokens: 0, cost: 0, detail: "Upstream response exceeded 2s timeout" },
  { id: "sp_05", traceId: "tr_4a11", name: "release_notes_writer", service: "docs-agent", kind: "agent", status: "ok", duration: 940, start: "09:40:41.220", tokens: 1760, cost: 0.011, detail: "Drafted release summary from 12 commits" },
  { id: "sp_06", traceId: "tr_4a11", name: "get_commits", service: "github-mcp", kind: "tool", status: "ok", duration: 144, start: "09:40:41.401", tokens: 0, cost: 0, detail: "Read 12 commits from the default branch" },
  { id: "sp_07", traceId: "tr_229d", name: "onboarding_copilot", service: "onboarding-agent", kind: "agent", status: "running", duration: 2210, start: "09:39:10.771", tokens: 3290, cost: 0.021, detail: "Waiting for create_workspace confirmation" },
  { id: "sp_08", traceId: "tr_229d", name: "lookup_workspace", service: "workspace-mcp", kind: "tool", status: "ok", duration: 186, start: "09:39:11.022", tokens: 0, cost: 0, detail: "Found workspace configuration" },
];

const durationSeries = [
  { time: "09:35", p50: 620, p95: 1610 }, { time: "09:36", p50: 710, p95: 1890 },
  { time: "09:37", p50: 580, p95: 1420 }, { time: "09:38", p50: 860, p95: 2240 },
  { time: "09:39", p50: 740, p95: 2110 }, { time: "09:40", p50: 680, p95: 1760 },
  { time: "09:41", p50: 920, p95: 2680 }, { time: "09:42", p50: 650, p95: 1840 },
];
const chartConfig = {
  p50: { label: "p50 duration", color: "var(--color-primary)" },
  p95: { label: "p95 duration", color: "#f59e0b" },
} satisfies ChartConfig;

export function loader({ request }: Route.LoaderArgs) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const status = params.get("status") ?? "all";
  const service = params.get("service") ?? "all";
  const spans = sampleSpans.filter((span) => {
    const matchesQuery = !query || [span.name, span.service, span.detail].join(" ").toLowerCase().includes(query);
    const matchesStatus = status === "all" || span.status === status;
    const matchesService = service === "all" || span.service === service;
    return matchesQuery && matchesStatus && matchesService;
  });
  return { spans, query, status, service, mode: "sample", generatedAt: "2026-08-31T09:43:00Z" };
}

export function meta() {
  return [
    { title: "Agent Trace Lens · Local-first agent observability" },
    { name: "description", content: "Inspect AI-agent and MCP traces with latency, cost, and failure context." },
  ];
}

function StatusBadge({ status }: { status: SpanStatus }) {
  if (status === "error") return <Badge variant="destructive" className="gap-1"><AlertTriangle className="size-3" /> Error</Badge>;
  if (status === "running") return <Badge variant="secondary" className="gap-1 text-amber-700"><Activity className="size-3" /> Running</Badge>;
  return <Badge variant="outline" className="gap-1 text-emerald-700"><CheckCircle2 className="size-3" /> OK</Badge>;
}

export default function Home() {
  const { spans, query, status, service, mode, generatedAt } = useLoaderData<typeof loader>();
  const totalTokens = spans.reduce((sum, span) => sum + span.tokens, 0);
  const visibleErrors = spans.filter((span) => span.status === "error").length;
  const services = [...new Set(sampleSpans.map((span) => span.service))];

  return (
    <main className="min-h-svh bg-[#f6f8f5] px-4 py-6 text-slate-950 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700"><span className="grid size-7 place-items-center rounded-lg bg-emerald-700 text-white"><Eye className="size-4" /></span> Agent Trace Lens</div>
            <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">See what your agents <span className="text-emerald-700">actually did.</span></h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">A local-first observability lens for AI agents and MCP tools. Follow the handoff from model call to tool result, then find the latency and failure that changed the outcome.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-amber-700"><span className="size-2 rounded-full bg-amber-500" /> Sample dataset</Badge><Button variant="outline" size="sm"><Download className="size-4" /> Export traces</Button></div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Trace metrics">
          <MetricCard label="Traces in window" value="1,284" note="+12.4% vs previous" icon={<Activity className="size-4" />} tone="emerald" />
          <MetricCard label="Error rate" value="7.8%" note={`${visibleErrors} visible in filtered view`} icon={<AlertTriangle className="size-4" />} tone="rose" />
          <MetricCard label="p95 duration" value="2.68s" note="Tool timeout is the outlier" icon={<Clock3 className="size-4" />} tone="amber" />
          <MetricCard label="Tokens observed" value={`${(totalTokens / 1000).toFixed(1)}k`} note="Sample window · estimated cost $0.08" icon={<Gauge className="size-4" />} tone="indigo" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Card className="border-slate-200 bg-white shadow-sm"><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle className="flex items-center gap-2 text-lg"><Clock3 className="size-5 text-emerald-700" /> Latency by percentile</CardTitle><CardDescription>Agent and tool spans · last 10 minutes · milliseconds</CardDescription></div><Badge variant="outline">OTLP-ready</Badge></div></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-[280px] w-full"><AreaChart accessibilityLayer data={durationSeries} margin={{ left: 0, right: 12, top: 12 }}><defs><linearGradient id="p50Fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-p50)" stopOpacity={0.24} /><stop offset="100%" stopColor="var(--color-p50)" stopOpacity={0} /></linearGradient><linearGradient id="p95Fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity={0.18} /><stop offset="100%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} strokeDasharray="4 4" /><XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={10} /><YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}ms`} width={52} /><ChartTooltip content={<ChartTooltipContent />} /><Area type="monotone" dataKey="p95" stroke="#f59e0b" fill="url(#p95Fill)" strokeWidth={2} /><Area type="monotone" dataKey="p50" stroke="var(--color-p50)" fill="url(#p50Fill)" strokeWidth={2} /></AreaChart></ChartContainer></CardContent></Card>
          <Card className="border-slate-200 bg-slate-950 text-white shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="size-5 text-emerald-300" /> Lens summary</CardTitle><CardDescription className="text-slate-400">A human-readable starting point for your next investigation.</CardDescription></CardHeader><CardContent className="space-y-5"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Primary signal</p><p className="mt-2 text-xl font-semibold">The ERP tool timeout drives the p95 spike.</p></div><Separator className="bg-slate-800" /><div className="space-y-3 text-sm text-slate-300"><p className="flex gap-2"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-400" /> 2.51s spent waiting for fetch_invoice.</p><p className="flex gap-2"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-400" /> Search and GitHub tools completed under 320ms.</p><p className="flex gap-2"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-sky-400" /> 3.2k tokens were used by the failing agent trace.</p></div><Button className="w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">Open investigation view <Eye className="size-4" /></Button></CardContent></Card>
        </section>

        <Card className="border-slate-200 bg-white shadow-sm"><CardHeader><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><CardTitle className="text-lg">Recent spans</CardTitle><CardDescription>Filter model and tool activity by service, status, or trace detail.</CardDescription></div><Form method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end"><div className="relative"><Label htmlFor="q" className="sr-only">Search spans</Label><Search className="absolute left-3 top-2.5 size-4 text-slate-400" /><Input id="q" name="q" defaultValue={query} placeholder="Search traces..." className="w-full pl-9 sm:w-56" /></div><div><Label htmlFor="status" className="sr-only">Status</Label><Select name="status" defaultValue={status}><SelectTrigger id="status" className="w-full sm:w-32"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All status</SelectItem><SelectItem value="ok">OK</SelectItem><SelectItem value="error">Error</SelectItem><SelectItem value="running">Running</SelectItem></SelectContent></Select></div><div><Label htmlFor="service" className="sr-only">Service</Label><Select name="service" defaultValue={service}><SelectTrigger id="service" className="w-full sm:w-44"><SelectValue placeholder="Service" /></SelectTrigger><SelectContent><SelectItem value="all">All services</SelectItem>{services.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><Button type="submit" variant="outline"><Filter className="size-4" /> Filter</Button></Form></div></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Span / trace</TableHead><TableHead>Service</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Duration</TableHead><TableHead className="text-right">Tokens</TableHead><TableHead className="text-right">Cost</TableHead></TableRow></TableHeader><TableBody>{spans.map((span) => <TableRow key={span.id} className="group"><TableCell><div className="min-w-64"><p className="font-medium text-slate-900">{span.name}</p><p className="mt-1 text-xs text-slate-500">{span.traceId} · {span.detail}</p></div></TableCell><TableCell className="font-mono text-xs text-slate-600">{span.service}</TableCell><TableCell><Badge variant="secondary" className="font-normal">{span.kind}</Badge></TableCell><TableCell><StatusBadge status={span.status} /></TableCell><TableCell className="text-right font-mono text-xs">{span.duration.toLocaleString()}ms</TableCell><TableCell className="text-right font-mono text-xs">{span.tokens ? span.tokens.toLocaleString() : "—"}</TableCell><TableCell className="text-right font-mono text-xs">{span.cost ? `$${span.cost.toFixed(3)}` : "—"}</TableCell></TableRow>)}{spans.length === 0 && <TableRow><TableCell colSpan={7} className="h-24 text-center text-slate-500">No spans match these filters.</TableCell></TableRow>}</TableBody></Table></div></CardContent></Card>
        <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex-row"><span>Mode: {mode} · refreshed {generatedAt.replace("T", " ").replace("Z", " UTC")}</span><span>Local-first by default · OpenTelemetry ingestion planned</span></footer>
      </div>
    </main>
  );
}

function MetricCard({ label, value, note, icon, tone }: { label: string; value: string; note: string; icon: ReactNode; tone: "emerald" | "rose" | "amber" | "indigo" }) {
  const tones = { emerald: "bg-emerald-50 text-emerald-700", rose: "bg-rose-50 text-rose-700", amber: "bg-amber-50 text-amber-700", indigo: "bg-indigo-50 text-indigo-700" };
  return <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p></div><span className={`grid size-9 place-items-center rounded-xl ${tones[tone]}`}>{icon}</span></div><p className="mt-3 text-xs text-slate-500">{note}</p></CardContent></Card>;
}
