import Link from "next/link";
import styles from "@/app/admin/Admin.module.css";
import type { Notice } from "@/lib/admin/notices";

/**
 * What is wrong with what is already live — R-26.1's safety net, on the pane.
 *
 * WHY IT IS PROMINENT AND NOT A TAB. R-26.1 removed the publish refusal and
 * recorded the consequence: an unsourced figure or a rate can now reach the
 * public site past a warning. The nightly sweep is what stands between that and
 * a reader, and a safety net nobody looks at is not one. So this sits above the
 * list on the pane the editorial team opens every day, and it says how many and
 * which rather than "some issues found".
 *
 * IT IS SILENT WHEN THERE IS NOTHING, deliberately. A strip that says "all
 * clear" every day is a strip people stop reading, and then it says something
 * one morning and they do not notice.
 *
 * EVERY ROW LINKS TO BOTH ENDS. The editor, because that is where it is fixed;
 * the live page, because the first question about a warning on a published
 * piece is what it actually looks like out there.
 */
export function NoticesStrip({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) return null;
  const findings = notices.reduce((n, notice) => n + notice.findings.length, 0);

  return (
    <section aria-labelledby="notices-head" className={styles.notices}>
      <h2 className={styles.noticesHead} id="notices-head">
        {notices.length} published piece{notices.length === 1 ? "" : "s"} with{" "}
        {findings} outstanding finding{findings === 1 ? "" : "s"}
      </h2>
      <p className={styles.noticesLede}>
        These are live on the site now. Every rule this cockpit runs is a
        warning rather than a refusal, so a piece can publish carrying one; this
        is where those come back. Nothing here changes what a reader sees until
        somebody edits the piece.
      </p>
      <ul className={styles.noticesList}>
        {notices.map((notice) => (
          <li
            className={styles.noticeRow}
            key={`${notice.contentType}-${notice.id}`}
          >
            <div className={styles.noticeHead}>
              <Link className={styles.noticeTitle} href={notice.editPath}>
                {notice.title || "Untitled"}
              </Link>
              <a
                className={styles.noticeLive}
                href={notice.publicPath}
                rel="noreferrer"
                target="_blank"
              >
                {notice.publicPath}
              </a>
            </div>
            <ul className={styles.noticeFindings}>
              {notice.findings.map((f) => (
                <li key={`${f.rule}-${f.field}-${f.message.slice(0, 32)}`}>
                  <span className={styles.noticeField}>{f.field}</span>
                  {f.message}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The two sentences A1 asks for on each pane's first run.
 *
 * IT EXPLAINS THE CYCLE, not the buttons. Somebody meeting this cockpit for the
 * first time does not need to be told what Publish does; they need to know that
 * creating and publishing are separate acts, and that nothing they do here is
 * irreversible.
 */
export function LifecycleHelp({ noun }: { noun: string }) {
  return (
    <p className={styles.note}>
      Every {noun} starts as a draft, which is on nobody&rsquo;s screen but
      yours; publishing is a separate, deliberate act that takes one confirm and
      puts it on the site within seconds. Nothing here is ever deleted, so
      unpublishing, archiving and moving a URL are all reversible, and every
      save leaves a revision you can restore.
    </p>
  );
}
