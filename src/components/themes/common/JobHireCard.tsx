import { Href, SVGPath } from "@/constants";
import { ProductCardType } from "@/types/Product";
import { RouteList } from "@/utils/RouteList";
import SvgIcon from "@/utils/SvgIcon";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import toast from "react-hot-toast";

const JobHireCard: FC<ProductCardType> = ({ data }) => {
  return (
    <div className='hire-box'>
      <div className='save-flex'>
        <span>{data.time}</span>
        <Link scroll={false} href={Href} className='save-btn' onClick={() => toast.success("successfully added in wishlist !")}>
          <i className='ri-bookmark-line' />
        </Link>
      </div>
      <div className='hire-info'>
        <div className='hire-icon'>
          {data.image.map((srcImage, i) => {
            return <Image height={50} width={50} key={i} src={`${SVGPath}/${srcImage}`} alt='j-1' className='img-fluid' />;
          })}
        </div>
        <Link href={RouteList.Job.Grid.JobGrid2}>
          <h6>{data.company}</h6>
        </Link>
        <div className='hire-tag'>
          {data.jobTags.map((tag, index) => (
            <label key={index}>{tag}</label>
          ))}
        </div>
        <Link href={RouteList.Job.Grid.JobGrid2}>
          <h5>{data.title}</h5>
        </Link>
        <ul className='hire-list'>
          <li>{data.location}</li>
          <li>
            <SvgIcon iconId='property/sprite/star.svg#star-svg' />
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
    </div>
  );
};

export default JobHireCard;
