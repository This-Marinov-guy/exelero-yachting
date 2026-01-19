"use client";
import GridView from "@/components/commonComponents/gridView";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import TopFilter from "@/components/commonComponents/TopFilter";
import { RouteList } from "@/utils/RouteList";

const BoatsPage = () => {
  return (
    <>
      <TopFilter />
      <Breadcrumbs 
        title="Boats" 
        url={RouteList.Home.CarDemo1} 
        mainClass="page-breadcrumbs-section" 
        image 
      />
      <GridView type={"property"} gridSize={4} cardShow={12} />
    </>
  );
};

export default BoatsPage;
