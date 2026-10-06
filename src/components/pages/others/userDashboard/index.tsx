"use client";
import { UnsavedChangesContext } from "./useUnsavedChanges";
import styles from "./AdminShell.module.scss";
import { ExternalLink } from "lucide-react";
import { AccountShellSkeleton } from "./AccountSkeleton";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { RouteList } from "@/utils/RouteList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import UserSidebar from "./userSidebar";
import { useAppDispatch } from "@/redux/hooks";
import Link from "next/link";

import DashboardTabs from "./dashboardTabs";
import { setActiveTab } from "@/redux/reducers/LayoutSlice";
import {
  ACCOUNT_TAB_QUERY_PARAM,
  AccountTabId,
  normalizeAccountTab,
} from "./accountTabs";

const UserDashboardContainer = () => {
  const [dirty, setDirty] = useState(false);
  const canLeave = useCallback(() => !dirty || window.confirm("Leave this section? Unsaved changes may be lost."), [dirty]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authStatus, setAuthStatus] = useState<"loading" | "authed" | "redirecting">("loading");
  const search = searchParams?.toString() ?? "";
  const requestedTab = searchParams?.get(ACCOUNT_TAB_QUERY_PARAM) ?? null;
  const [activeTab, setRenderedTab] = useState(() => normalizeAccountTab(requestedTab));
  const accountTabHref = useMemo(() => {
    const params = new URLSearchParams(search);
    params.set(ACCOUNT_TAB_QUERY_PARAM, activeTab);
    return `${pathname}?${params.toString()}`;
  }, [activeTab, pathname, search]);

  const handleTabChange = useCallback((tab: AccountTabId) => {
    if (tab === activeTab || !canLeave()) return;
    setDirty(false);
    const params = new URLSearchParams();
    params.set(ACCOUNT_TAB_QUERY_PARAM, tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, activeTab, canLeave]);

  useEffect(() => {
    const next = normalizeAccountTab(requestedTab);
    if (next !== activeTab) {
      if (canLeave()) { setDirty(false); setRenderedTab(next); }
      else router.replace(accountTabHref, { scroll: false });
      return;
    }
    if (requestedTab !== activeTab) router.replace(accountTabHref, { scroll: false });
    dispatch(setActiveTab(activeTab));
  }, [accountTabHref, activeTab, canLeave, dispatch, requestedTab, router]);

  useEffect(() => { document.getElementById("admin-content")?.focus(); }, [activeTab]);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowserClient();

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error || !data.session?.user) {
        setAuthStatus("redirecting");
        router.replace(RouteList.Auth.SignIn);
        return;
      }

      setAuthStatus("authed");
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setAuthStatus("authed");
      } else {
        setAuthStatus("redirecting");
        router.replace(RouteList.Auth.SignIn);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (authStatus !== "authed") {
    return <AccountShellSkeleton activeTab={activeTab} />;
  }

  return <div className={styles.shell}>
    <a className={styles.skip} href="#admin-content">Skip to content</a>
    <header className={styles.topbar}><div className={styles.brand}><strong>EXELERO</strong><span>Site admin</span></div><Link href="/" target="_blank" rel="noopener noreferrer">View website <ExternalLink size={16} /></Link></header>
    <div className={styles.layout}>
      <UserSidebar activeTab={activeTab} onTabChange={handleTabChange} canLeave={canLeave} />
      <main tabIndex={-1} id="admin-content" className={styles.content}><UnsavedChangesContext.Provider value={setDirty}><DashboardTabs activeTab={activeTab} onDirtyChange={setDirty} /></UnsavedChangesContext.Provider></main>
    </div>
  </div>;
};

export default UserDashboardContainer;
