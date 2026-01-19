'use client';
import React from "react";
import JobDetailBreadcrumb from "../../common/JobDetailBreadcrumb";
import JobDetail from "@/components/commonComponents/productDetail/JobDetail";

const JobDetail3Container = () => {
  return (
    <>
      <JobDetailBreadcrumb detailType={"detail-3"} />
      <JobDetail detailType={"detail-3"} />
    </>
  );
};

export default JobDetail3Container;
