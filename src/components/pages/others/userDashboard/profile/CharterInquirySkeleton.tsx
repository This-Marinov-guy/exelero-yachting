import styles from "./CharterInquiries.module.scss";

export default function CharterInquirySkeleton({ showHeading = true, kind = "charter" }: { showHeading?: boolean; kind?: "boat" | "partner" | "charter" | "transportation" }) {
  const contact = kind === "boat" || kind === "partner";
  return <div className={styles.skeleton} role="status" aria-label={`Loading ${kind} inquiries`} aria-busy="true">
    <span className="visually-hidden">Loading {kind} inquiries…</span>
    <div aria-hidden="true">
      {showHeading && <div className={styles.skeletonHeading}><div className={styles.skeletonBlock} /><div className={styles.skeletonBlock} /></div>}
      <div className={`${styles.skeletonFilters} ${contact ? styles.skeletonContactFilters : ""}`}>{Array.from({ length: contact ? 3 : 2 }, (_, index) => <div key={index}><div className={`${styles.skeletonBlock} ${styles.skeletonLabel}`} /><div className={`${styles.skeletonBlock} ${styles.skeletonInput}`} /></div>)}</div>
      <div className={styles.panel}>
        <div className={`${styles.skeletonTableHeader} ${contact ? styles.skeletonContactTable : ""}`}>{Array.from({ length: contact ? 8 : 7 }, (_, index) => <div className={styles.skeletonBlock} key={index} />)}</div>
        {Array.from({ length: 5 }, (_, index) => <div className={`${styles.skeletonRow} ${contact ? styles.skeletonContactTable : ""}`} key={index}>
          <div className={styles.skeletonBlock} />
          <div><div className={styles.skeletonBlock} /><div className={styles.skeletonBlock} /></div>
          <div className={styles.skeletonBlock} />
          {contact && <div className={styles.skeletonBlock} />}
          <div className={styles.skeletonBlock} />
          <div className={styles.skeletonBlock} />
          <div className={styles.skeletonBlock} />
          <div className={styles.skeletonBlock} />
        </div>)}
        <div className={styles.skeletonFooter}><div className={styles.skeletonBlock} /></div>
      </div>
    </div>
  </div>;
}
