import { JobAds1, JobAds2, JobAds3 } from "@/data/job";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import React, { FC } from "react";

type JobAdItem = {
  title: string;
  className: string;
  items: any[];
  isPrice?: boolean;
  isEmoji?: boolean;
};

const jobAdConfig: Record<number, JobAdItem> = {
  1: {
    title: "How much experience do you have?",
    className: "light-purple",
    items: JobAds1,
  },
  3: {
    title: "Filter jobs by salary",
    className: "light-red",
    items: JobAds2,
    isPrice: true,
  },
  5: {
    title: "How relevant do you find these jobs?",
    className: "light-blue",
    items: JobAds3,
    isEmoji: true,
  },
};

const JobAdsBox: FC<{ id: number }> = ({ id }) => {
  const config = jobAdConfig[id];
  if (!config) return null;

  return (
    <div className={`job-ad-box job-box ${config.className}`}>
      <h5>{config.title}</h5>
      <ul className={`ad-list${config.isPrice ? " price-filter" : ""}`}>
        {config.items.map((item, i) => (
          <li key={i}>
            <Link href={RouteList.Job.Detail.JobDetail1}>
              {config.isPrice ? (
                <>
                  ${item.dollar}
                  <span>{item.rupee}</span>
                </>
              ) : config.isEmoji ? (
                <>
                  {item.emoji}
                  <span>{item.tag}</span>
                </>
              ) : (
                <>
                  {item} <i className="ri-arrow-right-double-line" />
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobAdsBox;
