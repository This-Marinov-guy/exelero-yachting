import type { AccountTabId } from "./accountTabs";
import PartnerManagerSkeleton from "./partners/PartnerManagerSkeleton";
import CharterInquirySkeleton from "./profile/CharterInquirySkeleton";
import styles from "./AccountSkeleton.module.scss";

type SkeletonKind = "boats" | "dealers" | "drafts" | "boat-form" | "settings" | "profile" | "sidebar" | "edit-boat" | "tracking" | "generic";

function Block({ className = "" }: { className?: string }) {
  return <span className={`${styles.block} ${className}`} />;
}

function Heading({ action = false }: { action?: boolean }) {
  return <div className={styles.heading}><div><Block className={styles.title} /><Block className={styles.description} /></div>{action && <Block className={styles.action} />}</div>;
}

function Filters({ count = 2 }: { count?: number }) {
  return <div className={styles.filters}>{Array.from({ length: count }, (_, index) => <div key={index}><Block className={styles.label} /><Block className={styles.input} /></div>)}</div>;
}

function TableRows({ count = 5, image = false }: { count?: number; image?: boolean }) {
  return <div className={styles.table}><div className={styles.tableHead}>{Array.from({ length: 5 }, (_, index) => <Block key={index} />)}</div>{Array.from({ length: count }, (_, index) => <div className={styles.tableRow} key={index}><div className={styles.primaryCell}>{image && <Block className={styles.thumbnail} />}<div><Block /><Block className={styles.short} /></div></div><Block /><Block /><Block /><div className={styles.rowActions}><Block /><Block /></div></div>)}<div className={styles.tableFooter}><Block /></div></div>;
}

function FormFields({ count = 6 }: { count?: number }) {
  return <div className={styles.formFields}>{Array.from({ length: count }, (_, index) => <div key={index}><Block className={styles.label} /><Block className={styles.input} /></div>)}</div>;
}

export default function AccountSkeleton({ kind = "generic", heading = true, rows = 3 }: { kind?: SkeletonKind; heading?: boolean; rows?: number }) {
  const label = { boats: "boat listings", dealers: "dealers", drafts: "saved drafts", "boat-form": "boat form", settings: "account settings", profile: "profile", sidebar: "account navigation", "edit-boat": "boat details", tracking: "tracking report", generic: "account section" }[kind];
  return <div className={styles.skeleton} role="status" aria-busy="true" aria-label={`Loading ${label}`}><span className="visually-hidden">Loading {label}…</span><div aria-hidden="true">
    {kind === "boats" && <>{heading && <Heading action />}<Filters /><TableRows image /></>}
    {kind === "dealers" && <>{heading && <Heading action />}<Filters count={1} /><div className={styles.dealerGrid}>{[0, 1, 2].map(index => <div className={styles.dealerCard} key={index}><Block className={styles.avatar} /><Block className={styles.cardTitle} /><Block className={styles.cardLine} /><Block className={styles.cardLine} /><Block className={styles.cardLine} /></div>)}</div></>}
    {kind === "drafts" && <>{heading && <Block className={styles.title} />}<div className={styles.draftList}>{Array.from({ length: rows }, (_, index) => <div className={styles.draft} key={index}><div><Block className={styles.cardTitle} /><Block className={styles.cardLine} /></div><Block className={styles.action} /></div>)}</div></>}
    {kind === "boat-form" && <>{heading && <Heading />}<div className={styles.formCard}><Block className={styles.cardTitle} /><FormFields count={10} /><Block className={styles.wideField} /><Block className={styles.uploadArea} /></div></>}
    {kind === "settings" && <>{heading && <Heading />}<div className={styles.profileCard}><Block className={styles.avatar} /><div><Block className={styles.cardTitle} /><Block className={styles.cardLine} /></div></div><div className={styles.formCard}><Block className={styles.cardTitle} /><FormFields count={1} /><Block className={styles.action} /></div>{[0, 1].map(index => <div className={styles.disclosure} key={index}><Block className={styles.cardTitle} /></div>)}</>}
    {kind === "profile" && <div className={styles.profileInline}><Block className={styles.avatar} /><div><Block className={styles.cardTitle} /><Block className={styles.cardLine} /></div></div>}
    {kind === "sidebar" && <div className={styles.sidebarList}>{Array.from({ length: 6 }, (_, index) => <Block key={index} />)}</div>}
    {kind === "edit-boat" && <div className={styles.editGrid}><div><FormFields count={10} /></div><div><Block className={styles.label} /><Block className={styles.uploadArea} /><div className={styles.mediaTiles}>{[0, 1, 2].map(index => <Block key={index} />)}</div></div></div>}
    {kind === "tracking" && <><Heading /><Filters /><div className={styles.metrics}>{[0, 1, 2, 3].map(index => <Block key={index} />)}</div><Block className={styles.chart} /><Block className={styles.chart} /></>}
    {kind === "generic" && <>{heading && <Heading />}<div className={styles.formCard}><FormFields count={6} /></div></>}
  </div></div>;
}

export function AccountShellSkeleton({ activeTab }: { activeTab: AccountTabId }) {
  const kind: SkeletonKind = activeTab === "boats-listing" ? "boats" : activeTab === "dealer-info" ? "dealers" : activeTab === "upload-boat" ? "boat-form" : activeTab === "account-settings" ? "settings" : activeTab === "tracking" ? "tracking" : "generic";
  const inquiryKind = activeTab === "boat-inquiries" ? "boat" : activeTab === "partner-inquiries" ? "partner" : activeTab === "charter-requests" ? "charter" : activeTab === "transportation-requests" ? "transportation" : null;
  return <div className={styles.shell} role="status" aria-busy="true" aria-label="Loading account"><div className={styles.shellTop}><Block className={styles.brand} /><Block className={styles.topLink} /></div><div className={styles.shellLayout}><aside className={styles.shellNav}>{[0, 1, 2, 3].map(group => <div key={group}><Block className={styles.navHeading} />{Array.from({ length: group === 1 ? 3 : 2 }, (_, index) => <Block className={styles.navItem} key={index} />)}</div>)}</aside><main className={styles.shellContent}>{activeTab === "partners" ? <PartnerManagerSkeleton /> : inquiryKind ? <CharterInquirySkeleton kind={inquiryKind} /> : <AccountSkeleton kind={kind} />}</main></div></div>;
}
