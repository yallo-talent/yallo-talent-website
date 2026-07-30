import { logoRail } from "@/data/home/hero";
import { type Client, getConsentedClients } from "@/lib/clients";
import styles from "./Home.module.css";
import { LogoImage } from "./LogoImage";

/**
 * Two groups, never merged into one strip. Only names carrying consent render —
 * the loader filters at read time.
 *
 * A consented client with no logo file in the pack is set as a wordmark rather
 * than substituted with a similar logo or dropped.
 */
export function LogoRail() {
  const enterprise = getConsentedClients("enterprise");
  const integrators = getConsentedClients("integrators");

  return (
    <section className={styles.rail} aria-label="Clients and integrators">
      <div className={styles.wrap}>
        <div className={styles.railGroup}>
          <p className={styles.railLabel}>{logoRail.enterpriseLabel}</p>
          <LogoList clients={enterprise} />
        </div>
        <div className={styles.railGroup}>
          <p className={styles.railLabel}>{logoRail.integratorLabel}</p>
          <LogoList clients={integrators} />
        </div>
      </div>
    </section>
  );
}

function LogoList({ clients }: { clients: Client[] }) {
  return (
    <ul className={styles.logos}>
      {clients.map((c) => (
        <li key={c.name} className={styles.logo}>
          {c.logo ? (
            <LogoImage src={c.logo} width={120} height={30} />
          ) : (
            <span className={styles.wordmark}>{c.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
