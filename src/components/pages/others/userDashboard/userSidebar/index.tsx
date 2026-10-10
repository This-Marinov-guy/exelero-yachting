"use client";
import { useState } from "react";
import { Activity, Anchor, Building2, ChevronDown, FilePlus2, FileText, Handshake, LogOut, Mail, Settings, Ship, Truck, Plus } from "lucide-react";
import ModalLogout from "@/components/commonComponents/modal/ModalLogout";
import { useAppDispatch } from "@/redux/hooks";
import { setLogoutModal } from "@/redux/reducers/LayoutSlice";
import type { AccountTabId } from "../accountTabs";
import styles from "../AdminShell.module.scss";

const groups = [
  {
    title: "Overview",
    items: [{ id: "tracking", label: "Tracking", icon: Activity }],
  },
  {
    title: "Website",
    items: [
      { id: "charter-content", label: "Charter content", icon: FileText },
      {
        id: "transportation-content",
        label: "Transportation content",
        icon: Truck,
      },
      { id: "partners", label: "Partners", icon: Handshake },
      { id: "boats-listing", label: "Boat listings", icon: Ship },
      { id: "upload-boat", label: "Add a boat", icon: FilePlus2 },
      { id: "add-partner", label: "Add a partner", icon: Plus },
    ],
  },
  {
    title: "Inquiries",
    items: [
      { id: "boat-inquiries", label: "Boat brokerage", icon: Ship },
      { id: "partner-inquiries", label: "Partner inquiries", icon: Handshake },
      { id: "charter-requests", label: "Charter", icon: Mail },
      { id: "transportation-requests", label: "Transportation", icon: Truck },
    ],
  },
  {
    title: "Settings",
    items: [
      { id: "dealer-info", label: "Dealers", icon: Building2 },
      { id: "account-settings", label: "Account settings", icon: Settings },
    ],
  },
] as const;
export default function UserSidebar({ activeTab, onTabChange, canLeave }: { activeTab: AccountTabId; onTabChange: (tab: AccountTabId) => void; canLeave: () => boolean }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  return <aside className={styles.sidebar}>
    <button type="button" className={styles.menuButton} aria-expanded={open} aria-controls="account-navigation" onClick={() => setOpen(!open)}><span><Anchor size={18} /> Admin menu</span><ChevronDown size={18} /></button>
    <nav id="account-navigation" className={styles.navigation} data-open={open} aria-label="Site administration">
      {groups.map(group => <div key={group.title} className={styles.navGroup}><p>{group.title}</p>{group.items.map(({ id, label, icon: Icon }) => <a key={id} href={`/account?tab=${id}`} aria-current={activeTab === id ? "page" : undefined} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); onTabChange(id); setOpen(false); }}><Icon aria-hidden="true" />{label}</a>)}</div>)}
      <button className={styles.signout} type="button" onClick={() => { if (canLeave()) dispatch(setLogoutModal()); }}><LogOut size={18} />Sign out</button>
    </nav><ModalLogout />
  </aside>;
}
