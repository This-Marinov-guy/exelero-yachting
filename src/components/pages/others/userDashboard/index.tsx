"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import React from "react";
import { Container, Row } from "reactstrap";
import UserSidebar from "./userSidebar";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { Href } from "@/constants";
import DashboardTabs from "./dashboardTabs";

const UserDashboardContainer = () => {
  const { UserDashboardSidebar } = useAppSelector((state) => state.layout);

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
