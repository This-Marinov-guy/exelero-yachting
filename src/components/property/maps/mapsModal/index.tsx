"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";
import MapModal from "@/components/commonComponents/gridView/filter/MapModal";

const MapModalContainer = () => {
   
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"} gridSize={3} modalType="modal" cardShow={9}/>
      <MapModal type="property"/>
    </>
  )
}

export default MapModalContainer