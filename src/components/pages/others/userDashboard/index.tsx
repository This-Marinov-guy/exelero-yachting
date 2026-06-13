"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { RouteList } from "@/utils/RouteList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Container, Row } from "reactstrap";
import UserSidebar from "./userSidebar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { Href } from "@/constants";
import DashboardTabs from "./dashboardTabs";
import { setActiveTab } from "@/redux/reducers/LayoutSlice";
import {
  ACCOUNT_TAB_QUERY_PARAM,
  AccountTabId,
  normalizeAccountTab,
} from "./accountTabs";

const UserDashboardContainer = () => {
  const { UserDashboardSidebar } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authStatus, setAuthStatus] = useState<"loading" | "authed" | "redirecting">("loading");
  const search = searchParams?.toString() ?? "";
  const requestedTab = searchParams?.get(ACCOUNT_TAB_QUERY_PARAM) ?? null;
  const activeTab = normalizeAccountTab(requestedTab);
  const accountTabHref = useMemo(() => {
    const params = new URLSearchParams(search);
    params.set(ACCOUNT_TAB_QUERY_PARAM, activeTab);
    return `${pathname}?${params.toString()}`;
  }, [activeTab, pathname, search]);

  const handleTabChange = useCallback((tab: AccountTabId) => {
    const params = new URLSearchParams(search);
    params.set(ACCOUNT_TAB_QUERY_PARAM, tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, search]);

  useEffect(() => {
    if (requestedTab !== activeTab) {
      router.replace(accountTabHref, { scroll: false });
      return;
    }

    dispatch(setActiveTab(activeTab));
  }, [accountTabHref, activeTab, dispatch, requestedTab, router]);

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
    return <ExceleroLoader />;
  }

  return (
    <>
      <Breadcrumbs title='User Dashboard' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <section className='section-b-space user-dashboard-section'>
        <Container>
          <Row>
            <UserSidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <DashboardTabs activeTab={activeTab} />
          </Row>
        </Container>
      </section>
      <Link scroll={false} href={Href} className={`filter-overlay ${UserDashboardSidebar ? "show" : ""}`} />
    </>
  );
};

export default UserDashboardContainer;
