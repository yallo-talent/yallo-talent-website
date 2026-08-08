import { requirePane } from "@/lib/admin/guard";
import styles from "../../Admin.module.css";

/**
 * Pane 4, Articles. A PLACEHOLDER, and deliberately one. Round 20 §3.2.
 *
 * It states where articles live and what is coming, and it does nothing else.
 * No authoring, no upload, no watcher, no scheduled publish — §6 forbids all
 * four this round, and the Cowork-watcher idea was evaluated and rejected on
 * 7 August: an unattended job holding repository credentials is a direct push
 * wearing a different hat, which is the one thing the write path exists to
 * prevent.
 *
 * WHY A PANE AT ALL, rather than nothing. The nav is a promise about what the
 * cockpit does. Leaving articles out of it says the cockpit has nothing to do
 * with them, which is false — they are the next thing it will manage — and the
 * question "where do I put an article" then has no answer anywhere in the
 * product. An honest empty room beats a missing door.
 */
export const dynamic = "force-dynamic";

export default async function ArticlesPane() {
  await requirePane("articles");
  return (
    <>
      <h1 className={styles.h1}>Articles</h1>
      <p className={styles.lede}>
        Articles are authored as MDX in <code>content/insights/</code>, per the
        authoring guide, and the build validates every one of them before it can
        publish. Authoring from this cockpit arrives after cutover, together
        with team access. Until then this pane is here to say where they live,
        and it does nothing else: there is no upload, no scheduled publish and
        no unattended job holding repository credentials.
      </p>
      <p className={styles.empty}>
        Nothing to do here yet. Case studies are managed under Case studies.
      </p>
    </>
  );
}
