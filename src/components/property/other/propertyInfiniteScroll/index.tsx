"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";

const PropertyInfiniteScrollContainer = () => {
  return (
    <div>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"} gridSize={3} scrollType='infinite' />
    </div>
  );
};

export default PropertyInfiniteScrollContainer;
