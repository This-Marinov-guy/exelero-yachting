import { ApplyJob } from "@/constants";
import { ApplyJobDescription } from "@/data/job";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import React from "react";

const ApplyThisJob = () => {
  return (
    <div className='detail-sidebar-box'>
      <Link href={RouteList.Pages.Other.ContactUs1} className='btn-solid'>
        {ApplyJob}
      </Link>
      <ul className='sidebar-list'>
        {ApplyJobDescription.map((item, i) => {
          return (
            <li key={i}>
              {item.title} : <span>{item.Description}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ApplyThisJob;
