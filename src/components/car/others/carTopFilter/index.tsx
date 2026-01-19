'use client';
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import GridView from "@/components/commonComponents/gridView";
import { RouteList } from "@/utils/RouteList";

const CarTopFilterContainer = () => {
  return (
    <>
       <Breadcrumbs mainClass='car-breadcrumbs-section' title='Car Shop' url={RouteList.Home.CarDemo1} />
       <GridView type={"car"} side="nosidebar" sectionClass='car-shop-section car-product-section' filterClass='filter-sidebar' gridSize={3} tagClass='car-list-header' filter />
    </>
  )
}

export default CarTopFilterContainer