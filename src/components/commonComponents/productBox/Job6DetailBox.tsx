import { SVGPath } from "@/constants";
import { ProductCardType } from "@/types/Product";
import { RouteList } from "@/utils/RouteList";
import SvgIcon from "@/utils/SvgIcon";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import toast from "react-hot-toast";
import { Label } from "reactstrap";

const Job6DetailBox: FC<ProductCardType> = ({ data, userDashboard }) => {
  const JobTag = data.jobTags?.map((job) => job.replace("_", " "));

  return (
    <article className={`${userDashboard ? "white-card" : ""} hire-box`}>
      <div className={`save-flex ${!userDashboard ? "justify-content-end" : ""} `}>
        {userDashboard && <span>{data.time}</span>}
        <Link href={RouteList.Job.JobWishlist} onClick={() => toast.success("successfully added in wishlist !")} className='save-btn'>
          <i className='ri-bookmark-line' />
        </Link>
      </div>
      <div className='hire-info'>
        <div className='hire-icon'>
          {data.image.map((srcImage, i) => {
            return <Image height={50} width={50} key={i} src={`${SVGPath}/${srcImage}`} alt='j-1' className='img-fluid' />;
          })}
        </div>
        <Link href={RouteList.Job.Listing.JobLeftList}>
          <h6>{data.company}</h6>
        </Link>
        {!userDashboard && (
          <div className='hire-tag'>
            {JobTag?.map((item, i) => (
              <Label key={i}>{item}</Label>
            ))}
          </div>
        )}

        <Link href={RouteList.Job.Listing.JobLeftList}>
          <h5>{data.title}</h5>
        </Link>
        <ul className='hire-list'>
          <li>{data.location}</li>
          <li>
            <SvgIcon iconId='/property/sprite/star.svg#star-svg' />
            {data.rating}
          </li>
        </ul>
        <div className='applied-flex'>
          <span>{data.applied}</span>
          <Link href={RouteList.Pages.Other.ContactUs1} className='arrow-btn'>
            Apply Now <i className='ri-arrow-right-up-line' />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Job6DetailBox;
