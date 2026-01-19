import React from "react";
import JobApplyButton from "./JobApplyButton";
import { RightHeaderProps } from "@/types/Layout";
import AccountSection from "./AccountSection";
import Link from "next/link";
import { RouteList } from "@/utils/RouteList";
import { PostProperty } from "@/constants";
import LanguageSection from "./LanguageSection";

const RightHeader: React.FC<RightHeaderProps> = ({ part, isJobOrProperty }) => {
  const isLogin = ["job-2", "job-3"].some((item) => part?.includes(item));
  return (
    <div className='right-side-header'>
      {isLogin && <JobApplyButton part={part} />}
      {part?.includes("property") && (
        <Link href={RouteList.Pages.Other.UserDashboard} className='btn-solid'>
          {PostProperty}
        </Link>
      )}
      {!isJobOrProperty && (
        <div className='icon-side'>
          <AccountSection />
          {/* <LanguageSection part={part} /> */}
        </div>
      )}
    </div>
  );
};

export default RightHeader;
