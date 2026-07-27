import styles from "./OurPartners.module.css";

const partners: string[] = [
  "SAP",
  "Salesforce",
  "Oracle",
  "Anaplan",
  "Microsoft",
  "Blue Yonder",
  "Workday",
  "Manhattan",
  "Google Cloud",
  "Shopify",
  "IBM",
  "ServiceNow",
  "AWS",
  "Magento",
  "Coupa",
  "Infor",
];

export function OurPartners() {
  const doubled = [...partners, ...partners];

  return (
    <section className={styles.section} aria-label="Our partner platforms">
      <p className={styles.title}>our partners</p>
      <div className={styles.trackWrap}>
        <div className={styles.track}>
          {doubled.map((name, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: duplicate list intentionally has non-unique names for seamless marquee loop
              key={`${name}-${i}`}
              className={styles.card}
              aria-hidden={i >= partners.length ? "true" : undefined}
            >
              <span className={styles.name}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
