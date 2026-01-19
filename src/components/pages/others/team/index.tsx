"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import TeamGrid from "./TeamGrid";
import TeamDetail from "./TeamDetail";

const TeamContainer = () => {
  return (
    <>
      <Breadcrumbs title='Team' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <TeamGrid />
      <TeamDetail/>
    </>
  );
};

export default TeamContainer;
