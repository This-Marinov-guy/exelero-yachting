"use client";
import { useEffect, useId, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { AnalyticsReport, Breakdown, ProviderReport } from "@/types/Analytics";
import type { TrackingReport } from "@/types/Tracking";
import { DEFAULT_ANALYTICS_TIME_ZONE, dateInZone, pieSegments } from "@/lib/analytics/report";
import styles from "./TrackingDashboard.module.scss";

const number = new Intl.NumberFormat("en-GB");
const percent = (value: number) => `${(value * 100).toFixed(1)}%`;
const colours = ["#146a88", "#3f8d91", "#b77838", "#74639c", "#a55869", "#6e8350", "#8b969d"];
const dayLabel = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
function ProviderState({ report, name, retry }: { report: Exclude<ProviderReport<unknown>, { status: "ready" }>; name: string; retry: () => void }) {
  return <div className={styles.empty}><h3>{report.status === "not-connected" ? `Connect ${name}` : `${name} report unavailable`}</h3><p>{report.status === "not-connected" ? report.message : "Your other reports remain available. Retry this report when you’re ready."}</p>{report.status === "error" ? <button type="button" onClick={retry}>Try again</button> : <details><summary>Connection checklist</summary><p>Add the reporting credentials in the server settings and give the reporting service account access to this property. Then reload the report.</p><button type="button" onClick={retry}>Check connection</button></details>}</div>;
}
function Distribution({ title, rows, description }: { title: string; rows: Breakdown[]; description: string }) {
  const segments = pieSegments(rows);
  const total = segments.reduce((sum, item) => sum + item.value, 0);
  return <section className={styles.panel}><h2>{title}</h2><p className={styles.caption}>{description}</p>{total > 0 ? <><div className={styles.pie} role="img" aria-label={`${title}. Counts and shares are listed below.`}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={segments} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={2} stroke="none" isAnimationActive={false}>{segments.map((item, i) => <Cell key={item.name} fill={colours[i % colours.length]} />)}</Pie><Tooltip formatter={value => number.format(Number(value))} /></PieChart></ResponsiveContainer></div><ul className={styles.legend}>{segments.map((item, i) => <li key={item.name}><span className={styles.dot} style={{ background: colours[i % colours.length] }} /><span>{item.name === "(direct) / (none)" ? "Direct" : item.name}</span><strong>{number.format(item.value)}<small>{percent(item.value / total)}</small></strong></li>)}</ul></> : <p className={styles.smallEmpty}>No visits reported for this period.</p>}</section>;
}
function ClarityPanel({ report }: { report: TrackingReport }) {
  const metric = (value: number | null, suffix = "", digits = 0) => value === null ? "—" : `${value.toLocaleString("en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits })}${suffix}`;
  const unavailableCopy = report.status === "unavailable" ? {
    credentials: ["Clarity credentials need attention", "Generate a fresh Data Export token in Clarity and update the server setting."],
    quota: ["Clarity refresh limit reached", "Clarity limits exports to ten requests per day. The dashboard link remains available while the report refreshes."],
    connection: ["Clarity report unavailable", "The live experience report could not be reached. Try again after the next refresh."],
    response: ["Clarity returned an unfamiliar report", "Open the Clarity dashboard while the export connection is checked."],
  }[report.reason] : null;
  return <section className={`${styles.panel} ${styles.clarityPanel}`}>
    <div className={styles.sectionHeading}><div><h2>Visitor experience</h2><p className={styles.caption}>Rolling last 72 hours · Microsoft Clarity</p></div><a className={styles.external} href={report.dashboardUrl} target="_blank" rel="noopener noreferrer">Recordings & heatmaps <ArrowUpRight size={17} /></a></div>
    {report.status === "ready" ? <>
      <div className={styles.clarityMetrics}>
        {[
          { label: "Sessions", value: metric(report.summary.sessions), help: "Recorded visits" },
          { label: "Visitors", value: metric(report.summary.visitors), help: "Distinct visitors" },
          { label: "Pages / session", value: metric(report.summary.pagesPerSession, "", 2), help: "Average pages viewed" },
          { label: "Average scroll", value: metric(report.summary.scrollDepth, "%", 1), help: "Average page depth" },
          { label: "Dead clicks", value: metric(report.summary.deadClicks, "%", 1), help: "Sessions with ineffective clicks" },
          { label: "Rage clicks", value: metric(report.summary.rageClicks, "%", 1), help: "Sessions with repeated clicks" },
          { label: "Script errors", value: metric(report.summary.scriptErrors, "%", 1), help: "Sessions affected by errors" },
          { label: "Bot sessions", value: metric(report.summary.botSessions), help: "Automated traffic detected" },
        ].map(item => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong><p>{item.help}</p></div>)}
      </div>
      <p className={styles.clarityNote}>Clarity updates this export every six hours to stay within Microsoft’s reporting limit. Last fetched {new Date(report.fetchedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}.</p>
    </> : <div className={styles.inlineState}><h3>{report.status === "not_configured" ? "Connect Microsoft Clarity" : unavailableCopy?.[0]}</h3><p>{report.status === "not_configured" ? "Add the server-only Clarity Data Export token to show experience quality here." : unavailableCopy?.[1]}</p></div>}
  </section>;
}
export default function TrackingDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const gradientId = useId().replaceAll(":", "");
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [pageSearch, setPageSearch] = useState("");
  const [pageLimit, setPageLimit] = useState(10);
  const [queryLimit, setQueryLimit] = useState(10);
  const kind = params?.get("period") === "day" ? "day" : "month";
  const requestedDate = params?.get("date");
  const page = params?.get("page") || null;
  const query = new URLSearchParams({ period: kind, ...(requestedDate ? { date: requestedDate } : {}), ...(page ? { page } : {}) }).toString();
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort("timeout"), 45000);
    setLoading(true); setReport(null); setFailed(false); setPageLimit(10); setQueryLimit(10); setPageSearch("");
    void (async () => {
      try {
        const response = await fetch(`/api/admin/tracking?${query}`, { cache: "no-store", signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load tracking. Try again.");
        if (controller.signal.aborted) return;
        setReport(result);
        for (const provider of [result.analytics, result.search]) if (provider.status === "error") toast.error(provider.message);
      } catch (error) {
        if (controller.signal.aborted && controller.signal.reason !== "timeout") return;
        setFailed(true);
        toast.error(controller.signal.reason === "timeout" ? "The report took too long to load. Try again." : error instanceof Error ? error.message : "Could not load tracking. Try again.");
      } finally { clearTimeout(timeout); if (!controller.signal.aborted || controller.signal.reason === "timeout") setLoading(false); }
    })();
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [query, retry]);
  const today = report?.period.today || dateInZone(DEFAULT_ANALYTICS_TIME_ZONE);
  const date = requestedDate || (kind === "month" ? today.slice(0, 7) : today);
  const changePeriod = (period: "month" | "day", selected: string) => {
    if (!selected) return;
    const next = new URLSearchParams(params?.toString() || ""); next.set("period", period); next.set("date", selected);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const openPage = (path: string | null) => {
    const next = new URLSearchParams(params?.toString() || "");
    if (path) next.set("page", path); else next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const step = (amount: number) => {
    const value = new Date(`${kind === "month" ? `${date}-01` : date}T12:00:00Z`);
    if (!Number.isFinite(value.getTime())) { changePeriod("month", today.slice(0, 7)); return; }
    if (kind === "month") value.setUTCMonth(value.getUTCMonth() + amount); else value.setUTCDate(value.getUTCDate() + amount);
    changePeriod(kind, value.toISOString().slice(0, kind === "month" ? 7 : 10));
  };
  const data = report?.analytics.status === "ready" ? report.analytics.data : null;
  const pages = data?.pages.filter(item => item.path.toLowerCase().includes(pageSearch.toLowerCase())) || [];
  const refresh = () => setRetry(value => value + 1);
  return <div className={styles.dashboard}>
    <header className={styles.heading}><div><p className={styles.eyebrow}>Website performance</p><h1>{page ? "Page details" : "Tracking"}</h1><p>Understand your visitors and the pages they explore.</p></div>{report && <a className={styles.external} href={report.clarity.dashboardUrl} target="_blank" rel="noopener noreferrer">Clarity recordings <ArrowUpRight size={17} /></a>}</header>
    {page && <div className={styles.pageHeading}><button type="button" onClick={() => openPage(null)}><ArrowLeft size={16} />All pages</button><strong>{page}</strong></div>}
    <div className={styles.controls} aria-label="Reporting period">
      <div className={styles.shortcuts}><button type="button" aria-pressed={kind === "month" && date === today.slice(0, 7)} onClick={() => changePeriod("month", today.slice(0, 7))}>This month</button><button type="button" aria-pressed={kind === "day" && date === today} onClick={() => changePeriod("day", today)}>Today</button></div>
      <label>View<select value={kind} onChange={event => { const mode = event.target.value as "month" | "day"; changePeriod(mode, mode === "month" ? date.slice(0, 7) : date.length === 7 ? `${date}-01` : date); }}><option value="month">Month</option><option value="day">Day</option></select></label>
      <label>{kind === "month" ? "Month" : "Date"}<input type={kind === "month" ? "month" : "date"} value={date} min={kind === "month" ? "2005-01" : "2005-01-01"} max={kind === "month" ? today.slice(0, 7) : today} onChange={event => changePeriod(kind, event.target.value)} /></label>
      <div className={styles.arrows}><button type="button" aria-label={`Previous ${kind}`} disabled={date <= (kind === "month" ? "2005-01" : "2005-01-01")} onClick={() => step(-1)}><ChevronLeft size={18} /></button><button type="button" aria-label={`Next ${kind}`} disabled={date >= (kind === "month" ? today.slice(0, 7) : today)} onClick={() => step(1)}><ChevronRight size={18} /></button></div>
      <button type="button" className={styles.refresh} onClick={refresh} disabled={loading} aria-label="Reload reports"><RefreshCw size={18} /></button>
    </div>
    {loading ? <div className={styles.skeleton} role="status" aria-label="Loading reports"><div className={styles.skeletonMetrics}>{[1,2,3,4].map(key => <div key={key} />)}</div><div className={styles.skeletonChart} /><div className={styles.skeletonChart} /></div> : failed ? <div className={styles.empty}><h2>Report unavailable</h2><p>Reload the report, or select another period.</p><button type="button" onClick={refresh}>Try again</button></div> : report && <>
      <p className={styles.period}>{dayLabel(report.period.start)}{report.period.end !== report.period.start && ` – ${dayLabel(report.period.end)}`}<span>· {data?.timeZone || report.period.timeZone}{report.period.end === today ? " · Today’s figures are still updating" : ""}</span></p>
      {data ? <>
        <div className={styles.metrics}>{([{ label: "Visits", value: number.format(data.totals.visits), help: page ? "Sessions that included this page" : "Sessions on the website" }, { label: "Visitors", value: number.format(data.totals.visitors), help: "Unique users for this period" }, { label: "Page views", value: number.format(data.totals.views), help: "Includes repeat views" }, { label: "Engagement", value: percent(data.totals.engagementRate), help: "Share of engaged sessions" }]).map(item => <section key={item.label}><h2>{item.label}</h2><strong>{item.value}</strong><p>{item.help}</p></section>)}</div>
        {!page && <ClarityPanel report={report.clarity} />}
        <section className={styles.panel}><div className={styles.sectionHeading}><div><h2>Traffic over time</h2><p className={styles.caption}>{kind === "month" ? "Daily visits" : "Hourly visits"} · Google Analytics</p></div><span className={styles.chartKey}><span className={styles.dot} style={{ background: colours[0] }} />Visits</span></div>
          {data.totals.visits > 0 ? <div className={styles.trafficChart} aria-label="Visits over time. Use the data table below for exact figures."><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.traffic} margin={{ top: 16, right: 16, bottom: 4, left: -12 }} accessibilityLayer><defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#146a88" stopOpacity={0.2} /><stop offset="100%" stopColor="#146a88" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid stroke="#e6edef" vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={28} tick={{ fill: "#60747b", fontSize: 12 }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#60747b", fontSize: 12 }} /><Tooltip formatter={value => [number.format(Number(value)), "Visits"]} /><Area type="monotone" dataKey="visits" stroke="#146a88" strokeWidth={2} fill={`url(#${gradientId})`} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div> : <div className={styles.empty}><h3>No visits reported</h3><p>Try another period. Recent traffic can take time to appear.</p></div>}
          <details className={styles.dataDetails}><summary>{kind === "month" ? "View daily figures and open a day" : "View hourly figures"}</summary><div className={styles.tableScroll} role="region" aria-label="Traffic figures" tabIndex={0}><table><thead><tr><th scope="col">{kind === "month" ? "Day" : "Hour"}</th><th scope="col">Visits</th><th scope="col">Visitors</th><th scope="col">Views</th></tr></thead><tbody>{data.traffic.map(point => <tr key={point.date}><th scope="row">{kind === "month" ? <button className={styles.textButton} type="button" onClick={() => changePeriod("day", point.date)}>{point.label} <ArrowUpRight size={14} /></button> : point.label}</th><td>{number.format(point.visits)}</td><td>{number.format(point.visitors)}</td><td>{number.format(point.views)}</td></tr>)}</tbody></table></div></details>
        </section>
        {!page && <section className={styles.panel}><div className={styles.sectionHeading}><div><h2>Most popular pages</h2><p className={styles.caption}>Open a page to explore its traffic and acquisition.</p></div><label className={styles.pageSearch}><span className="visually-hidden">Find a page</span><input type="search" placeholder="Find a page" value={pageSearch} onChange={event => { setPageSearch(event.target.value); setPageLimit(10); }} /></label></div><div className={styles.tableScroll} role="region" aria-label="Popular pages" tabIndex={0}><table><thead><tr><th scope="col">Page</th><th scope="col">Views</th><th scope="col">Visitors</th><th scope="col">Visits</th></tr></thead><tbody>{pages.slice(0, pageLimit).map(item => <tr key={item.path}><th scope="row"><button className={styles.textButton} type="button" onClick={() => openPage(item.path)}>{item.path === "/" ? "Homepage /" : item.path}<ArrowUpRight size={15} /></button></th><td>{number.format(item.views)}</td><td>{number.format(item.visitors)}</td><td>{number.format(item.visits)}</td></tr>)}</tbody></table></div>{!pages.length && <p className={styles.smallEmpty}>{pageSearch ? "No pages match your search." : "No page views reported for this period."}</p>}<div className={styles.tableFooter}><span>Showing {Math.min(pageLimit, pages.length)} of {pages.length} pages{data.pageCount > 100 ? " · Top 100 by views" : ""}</span>{pages.length > pageLimit && <button type="button" onClick={() => setPageLimit(limit => limit + 20)}>Show more pages</button>}</div></section>}
        <div className={styles.distributions}><Distribution title="Referrals & sources" description="Visits by source and medium" rows={data.sources} /><Distribution title="Channels" description="How visitors find the website" rows={data.channels} /><Distribution title="Regions" description="Visits by region and country" rows={data.regions} /></div>
        {data.limited && <p className={styles.caption}>Google has sampled, grouped or withheld some figures in this report.</p>}
      </> : report.analytics.status !== "ready" && <><ProviderState report={report.analytics} name="Google Analytics" retry={refresh} />{!page && <ClarityPanel report={report.clarity} />}</>}
      <section className={styles.panel}><h2>Search queries{page ? " for this page" : ""}</h2><p className={styles.caption}>Google Search · Top queries by clicks · Search Console</p>{report.search.status === "ready" ? <>{report.search.data.queries.length > 0 ? <><div className={styles.tableScroll} role="region" aria-label="Search queries" tabIndex={0}><table><thead><tr><th scope="col">Search query</th><th scope="col">Clicks</th><th scope="col">Impressions</th><th scope="col">CTR</th><th scope="col">Avg. position</th></tr></thead><tbody>{report.search.data.queries.slice(0, queryLimit).map(item => <tr key={item.query}><th scope="row">{item.query}</th><td>{number.format(item.clicks)}</td><td>{number.format(item.impressions)}</td><td>{percent(item.ctr)}</td><td>{item.position.toFixed(1)}</td></tr>)}</tbody></table></div>{report.search.data.queries.length > queryLimit && <button type="button" onClick={() => setQueryLimit(limit => limit + 20)}>Show more queries</button>}</> : <div className={styles.smallEmpty}><h3>No search queries available</h3><p>Try an earlier period. Recent and low-volume searches may not appear.</p></div>}<p className={styles.searchNote}>Search Console uses Pacific time. Recent data may be delayed and some queries are withheld for privacy.{report.search.data.incompleteFrom ? ` Figures from ${dayLabel(report.search.data.incompleteFrom)} are provisional.` : ""}</p></> : <ProviderState report={report.search} name="Search Console" retry={refresh} />}</section>
      <p className={styles.updated}>Report fetched {new Date(report.fetchedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
    </>}
  </div>;
}
