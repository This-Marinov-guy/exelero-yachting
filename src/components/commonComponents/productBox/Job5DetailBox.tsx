import { SVGPath } from "@/constants";
import { ProductCardType } from "@/types/Product";
import { RouteList } from "@/utils/RouteList";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import toast from "react-hot-toast";
import { Label } from "reactstrap";

const Job5DetailBox: FC<ProductCardType> = ({ data }) => {
  const JobTag = data.jobType?.map((job) => job.replace("_", " "));

  return (
    <article className='job-box job-box-style-2'>
      <div className='job-title-flex align-items-center'>
        <Link href={RouteList.Job.Detail.JobDetail1} className='job-detail'>
          <h5>{data.title}</h5>
        </Link>
        <Link href={RouteList.Job.JobWishlist} onClick={() => toast.success("successfully added in wishlist !")} className='save-btn'>
          <i className='ri-bookmark-line' />
        </Link>
      </div>
      <h5 className='price-style-2'>{data.salary}K USD</h5>
      <div className='job-tag job-tag-style-2'>
        {JobTag?.slice(0,2).map((item, i) => (
          <Label key={i}>{item}</Label>
        ))}
      </div>
      <div className='post-style-2'>
        <span>{data.time}</span>
      </div>
      <div className='job-title'>
        <div className='job-icon'>
          {data.image.map((srcImage, i) => {
            return <Image height={50} width={50} key={i} src={`${SVGPath}/${srcImage}`} alt='j-1' className='img-fluid' />;
          })}
        </div>
        <Link href={RouteList.Job.Detail.JobDetail1} className='job-detail'>
          <span>{data.company}</span>
          <div className='bottom-location'>
            <MapPin className='iconsax' />
            <span className='mb-0'>{data.location}</span>
          </div>
        </Link>
      </div>
    </article>
  );
};

export default Job5DetailBox;
