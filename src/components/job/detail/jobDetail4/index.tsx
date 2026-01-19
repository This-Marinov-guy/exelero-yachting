"use client";
import React from "react";
import JobDetailBreadcrumb from "../../common/JobDetailBreadcrumb";
import JobDetail from "@/components/commonComponents/productDetail/JobDetail";

const JobDetail4Container = () => {
  return (
    <>
      <JobDetailBreadcrumb detailType={"detail-4"} />
      <JobDetail detailType={"detail-4"} />
    </>
  );
};

export default JobDetail4Container;
