"use client";

import { FC } from "react";
import { ProductType } from "@/types/Product";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import BoatDetail from "./BoatDetail";
import { usePublicText } from "@/lib/usePublicText";

interface BoatDetailContainerProps {
  boat: ProductType;
}

const BoatDetailContainer: FC<BoatDetailContainerProps> = ({ boat }) => {
  const tr = usePublicText();
  return (
    <>
      <Breadcrumbs 
        title={boat.title} 
        headingLevel={1}
        url={RouteList.Home.CarDemo1} 
        subTitle={tr("Brokerage")}
        mainClass="page-breadcrumbs-section brokerage-detail-breadcrumb"
        image
      />
      <BoatDetail boat={boat} />
    </>
  );
};

export default BoatDetailContainer;
