"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { UserPrivacy } from "@/constants";
import { PrivacyNavListData, PrivacyPolicyData } from "@/data/pages/Others";
import { RouteList } from "@/utils/RouteList";
import Scrollspy from "../common/scrollspy";

const PrivacyContainer = () => {
  return (
    <>
      <Breadcrumbs title='Privacy' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <Scrollspy title={UserPrivacy} list={PrivacyNavListData} content={PrivacyPolicyData} />
    </>
  );
};

export default PrivacyContainer;
