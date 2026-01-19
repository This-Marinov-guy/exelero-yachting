"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { ConditionsTitle } from "@/constants";
import { ConditionData, ConditionNavListData } from "@/data/pages/Others";
import { RouteList } from "@/utils/RouteList";
import Scrollspy from "../common/scrollspy";

const ConditionContainer = () => {
  return (
    <>
      <Breadcrumbs title='Conditions' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <Scrollspy title={ConditionsTitle} list={ConditionNavListData} content={ConditionData} />
    </>
  );
};

export default ConditionContainer;
