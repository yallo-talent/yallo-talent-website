import { NextResponse } from "next/server";
import { funnelView } from "@/app/(admin)/admin/(cockpit)/briefs/page";
import { csvRow, FUNNEL_LABELS, leadCard, slaFor } from "@/lib/admin/funnel";
import { assertPane } from "@/lib/admin/guard";
import { readBriefs } from "@/lib/admin/reads";
import { readFunnel } from "@/lib/db/funnel";

/**
 * The current view as CSV — cockpit-v3 §11.
 *
 * IT IMPORTS THE PANE'S OWN FILTER, and that is the whole design. "Export the
 * current view" is a promise about agreement: what comes out of the file has to
 * be what was on screen. A second filter implementation here would be a second
 * answer to what "current" means, and the day the two disagreed nobody would
 * notice — they would simply stop trusting the export.
 *
 * ADMIN AND OPS, per §11, which is the same set that may READ the pane. Reading
 * a view and exporting the same view are the same act with a different
 * destination, so this asserts the pane rather than a narrower capability.
 *
 * A ROUTE HANDLER GUARDS ITSELF. It sits outside the (cockpit) route group, so
 * the layout's session check does not run on this request — `assertPane` is the
 * only thing between an anonymous GET and every lead the site has captured.
 *
 * NO CACHE, EVER. This is personal data behind a session; a cached response is
 * a response served to the next caller.
 */
export const dynamic = "force-dynamic";

const HEADERS = [
  "captured_at_utc",
  "state",
  "owner",
  "hours_since_capture",
  "sla_band",
  "source",
  "name",
  "email",
  "company",
  "role",
  "region",
  "engagement",
  "platform",
  "message",
  "delivered",
  "transcript_id",
  "submission_id",
];

export async function GET(request: Request) {
  try {
    await assertPane("briefs");
  } catch {
    return NextResponse.json(
      { error: "You do not have access to briefs." },
      { status: 403 },
    );
  }

  const params = new URL(request.url).searchParams;
  const filters = Object.fromEntries(params.entries());

  const rows = await readBriefs(500);
  const funnel = await readFunnel();
  const now = new Date();
  const view = funnelView(rows, funnel, filters, now);

  const lines = [csvRow(HEADERS)];
  for (const { row, state, owner } of view) {
    const card = leadCard(row.payload);
    const sla = slaFor(row.createdAt, state, now);
    const delivered = Object.values(row.deliveryStatus ?? {}).some(
      (o) => o?.delivered,
    );
    lines.push(
      csvRow([
        row.createdAt,
        FUNNEL_LABELS[state],
        owner,
        String(sla.hours),
        sla.band,
        row.endpoint,
        card.name,
        card.email,
        card.company,
        card.role,
        card.region,
        card.engagement,
        card.platform,
        card.message,
        delivered ? "yes" : "no",
        row.transcriptRef,
        row.id,
      ]),
    );
  }

  const stamp = now.toISOString().slice(0, 10);
  return new NextResponse(
    /* A BOM, so Excel opens UTF-8 correctly. Without it a company name with an
       accent in it arrives mangled, and the person who opens the file concludes
       the data is wrong rather than the encoding. */
    `﻿${lines.join("\r\n")}\r\n`,
    {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="yallo-leads-${stamp}.csv"`,
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
