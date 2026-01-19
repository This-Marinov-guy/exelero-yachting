import { SVGPath } from "@/constants";
import { RightSideJobData } from "@/data/job";
import { RightJobBox } from "@/types/Product";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

const RightJobsBox: FC<RightJobBox> = ({ title, type }) => {
  return (
    <div className={`${type !== "both-side" ? "detail-sidebar-box" : ""}`}>
      <div className={`${type === "both-side" ? "right-sidebar" : "detail-right-sidebar"}`}>
        <h6 className={`${type === "both-side" ? "sidebar-title" : "description-title"}`}>{title}</h6>
        {RightSideJobData.map((item, i) => {
          return (
            <div className={`${type === "both-side" ? "sidebar-job-box" : "other-job-box"} `} key={i}>
              <div className='job-icon'>
                <Image height={50} width={50} src={`${SVGPath}/${item.icon}`} alt={`j-${i + 1}`} className='img-fluid' />
              </div>
              <Link scroll={false} href={RouteList.Job.Grid.Job2RightGrid} className={`${type !== "both-side" ? "job-content" : ""}`}>
                {item.title}
                <span>{item.company}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RightJobsBox;
