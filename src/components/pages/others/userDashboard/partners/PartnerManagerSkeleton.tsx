import styles from "./PartnerManager.module.scss";

export default function PartnerManagerSkeleton({ mode = "manage" }: { mode?: "manage" | "create" }) {
  return <div className={styles.skeleton} role="status" aria-busy="true" aria-label={mode === "create" ? "Loading new partner form" : "Loading partners"}>
    <span className="visually-hidden">{mode === "create" ? "Loading new partner form…" : "Loading partners…"}</span>
    <div aria-hidden="true">
      <div className={styles.skeletonHeading}><div><div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} /><div className={`${styles.skeletonBlock} ${styles.skeletonDescription}`} /></div>{mode === "manage" && <div className={`${styles.skeletonBlock} ${styles.skeletonButton}`} />}</div>
      {mode === "manage" && <><div className={styles.skeletonFilters}><div className={styles.skeletonBlock} /><div className={styles.skeletonBlock} /></div>
      <div className={styles.partnerRail}>{Array.from({ length: 6 }, (_, index) => <div className={styles.skeletonPartner} key={index}><div className={`${styles.skeletonBlock} ${styles.skeletonLogo}`} /><div className={styles.skeletonBlock} /><div className={styles.skeletonBlock} /></div>)}</div></>}
      <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
      <div className={styles.skeletonSection}><div className={`${styles.skeletonBlock} ${styles.skeletonLabel}`} /><div className={styles.fieldGrid}>{Array.from({ length: 2 }, (_, index) => <div className={styles.skeletonField} key={index}><div className={`${styles.skeletonBlock} ${styles.skeletonLabel}`} /><div className={styles.skeletonBlock} /></div>)}</div></div>
      {[0, 1, 2].map(index => <div className={styles.skeletonDisclosure} key={index}><div className={`${styles.skeletonBlock} ${styles.skeletonLabel}`} /></div>)}
    </div>
  </div>;
}
