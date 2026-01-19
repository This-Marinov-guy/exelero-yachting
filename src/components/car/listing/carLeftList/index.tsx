'use client';
import Breadcrumbs from '@/components/commonComponents/breadcrumb';
import GridView from "@/components/commonComponents/gridView";
import { RouteList } from '@/utils/RouteList';

const CarLeftListContainer = () => {
  return (
    <>
        <Breadcrumbs mainClass='car-breadcrumbs-section' title='Car Shop' url={RouteList.Home.CarDemo1} />
        <GridView type={"car"} sectionClass='car-shop-section car-product-section' filterClass='car-shop-sidebar' gridType='list-view' gridSize={1} cardShow={9} tagClass='car-list-header' />
    </>
  )
}

export default CarLeftListContainer