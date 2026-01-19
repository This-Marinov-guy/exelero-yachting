import { SVGPath } from "@/constants";
import { Skills } from "@/data/job";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

const JobMainDetail: FC<{ type: string }> = ({ type }) => {
  return (
    <div className={`top-detail ${type ? "top-detail-style-2" : ""} `}>
      <div className='detail-title-flex'>
        <div className='job-icon'>
          <Image height={90} width={90} src={`${SVGPath}/job/job-box/1.svg`} alt='j-1' className='img-fluid' />
        </div>
        <div className='top-title'>
          <div className='review-title-flex'>
            <div>
              <h5>Allies Infotech</h5>
              <span className='review-rating'>
                <span>
                  <i className='ri-star-fill' />
                  4.3
                </span>
                85 Review
              </span>
            </div>
              {type==='detail-4' && <Link href={RouteList.Pages.Other.ContactUs1} className="btn-border">Apply Now</Link>}
          </div>
          <ul className='review-list'>
            <li>
              <i className='ri-time-line' /> : <span>30+ days ago</span>
            </li>
            <li>
              <i className='ri-team-line' /> Applicants:
              <span>20 people View</span>
            </li>
          </ul>
          <div className='flex-address'>
            <i className='ri-map-pin-line' />
            <p>Puerta 830 Grupo Norma Munguía 50 Puerta 890, San Sebastían de los Reyes, Man 74332</p>
          </div>
          <ul className='skill-list'>
            {Skills.map((_, i) => (
              <li key={i}>
                <span>{_}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobMainDetail;
