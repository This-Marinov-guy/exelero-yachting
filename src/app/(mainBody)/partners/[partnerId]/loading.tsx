import styles from "./loading.module.scss";

function Block({ className = "" }: { className?: string }) {
  return <div className={`${styles.block} ${className}`} />;
}

export default function PartnerLoading() {
  return (
    <main className={styles.page} role="status" aria-busy="true" aria-label="Loading partner details">
      <span className="visually-hidden">Loading partner details…</span>
      <div aria-hidden="true">
        <div className={styles.hero}>
          <div className="container">
            <Block className={styles.logo} />
          </div>
        </div>
        <div className={`container ${styles.content}`}>
          <div className={styles.mainColumn}>
            <Block className={styles.image} />
            <Block className={styles.heading} />
            <Block className={styles.line} />
            <Block className={styles.line} />
            <Block className={styles.shortLine} />
          </div>
          <div className={styles.inquiry}>
            <Block className={styles.inquiryHeading} />
            {[0, 1, 2].map((item) => (
              <div className={styles.field} key={item}>
                <Block className={styles.label} />
                <Block className={styles.input} />
              </div>
            ))}
            <Block className={styles.submit} />
          </div>
        </div>
      </div>
    </main>
  );
}
