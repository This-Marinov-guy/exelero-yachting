"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import ExceleroLoader from "@/components/commonComponents/ExceleroLoader";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { RouteList } from "@/utils/RouteList";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import UserSidebar from "./userSidebar";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { Href } from "@/constants";
import DashboardTabs from "./dashboardTabs";

const UserDashboardContainer = () => {
  const { UserDashboardSidebar } = useAppSelector((state) => state.layout);
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<"loading" | "authed" | "redirecting">("loading");

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
            <UserSidebar />
            <DashboardTabs/>
          </Row>
        </Container>
      </section>
      <Link scroll={false} href={Href} className={`filter-overlay ${UserDashboardSidebar ? "show" : ""}`} />
    </>
  );
};

export default UserDashboardContainer;
