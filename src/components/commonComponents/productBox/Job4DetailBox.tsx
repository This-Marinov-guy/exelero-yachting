import { Href, SVGPath } from "@/constants";
import { ProductCardType } from "@/types/Product";
import { RouteList } from "@/utils/RouteList";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import toast from "react-hot-toast";
import { Progress } from "reactstrap";

const Job4DetailBox: FC<ProductCardType> = ({ data }) => {

  return (
    <article className='job-box'>
      <div className='job-title-flex'>
        <div className='job-title'>
          <div className='job-icon'>
            {data.image.map((srcImage, i) => {
              return <Image height={50} width={50} key={i} src={`${SVGPath}/${srcImage}`} alt='j-1' className='img-fluid' />;
            })}
          </div>
          <Link href={RouteList.Job.Detail.JobDetail1} className='job-detail'>
            <h5>{data.title}</h5>
            <div className='d-flex align-items-center gap-1 mt-1'>
            <MapPin className='iconsax' />
              <span className='border-0 p-0 mb-0'>{data.location}</span>
            </div>
          </Link>
        </div>
        <Link href={Href} scroll={false} onClick={() => toast.success('successfully added in wishlist !')} className='save-btn'>
          <i className='ri-bookmark-line' />
        </Link>
      </div>
      <div className='job-tag'>
        <label>
          <Image height={18} width={18} src={`${SVGPath}/job/job-box/dollar-circle.svg`} alt='dollar-circle' className='img-fluid' />
           {data.salary}K USD
        </label>
        <label>
          <Image height={18} width={18} src={`${SVGPath}/job/job-box/briefcase.svg`} alt='briefcase' className='img-fluid' />
          {data.jobType?.slice(0, 1).map((job) => job.replace("_", " "))}
        </label>
      </div>
      <p>{data.description}</p>
      <h6>
        20 applied of <span>{data.progress} vacancy</span>
      </h6>
      <Progress animated color="warning" striped value={data.progress}/>
      <div className='btn-flex'>
        <div className='d-flex align-items-center gap-1 mt-1'>
        <Clock className='iconsax' />
          <span>{data.time}</span>
        </div>
        <Link href={RouteList.Pages.Other.ContactUs1} className='arrow-btn'>
          Apply Now <i className='ri-arrow-right-up-line' />
        </Link>
      </div>
    </article>
  );
};

export default Job4DetailBox;
