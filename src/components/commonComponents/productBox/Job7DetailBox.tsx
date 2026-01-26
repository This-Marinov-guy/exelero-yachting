import { ApplyNow, Href, SVGPath } from "@/constants";
import { ProductCardType } from "@/types/Product";
import { RouteList } from "@/utils/RouteList";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import toast from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import { Label } from "reactstrap";

const Job7DetailBox: FC<ProductCardType> = ({ data }) => {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").slice(1);
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
            <span>{data.company}</span>
            <h5>{data.title}</h5>
          </Link>
        </div>
        <Link href={Href} onClick={() => toast.success("Successfully added in wishlist !")} className='save-btn'>
          <i className='ri-bookmark-line' />
        </Link>
      </div>
      <div className='job-tag-flex'>
        <div className='job-tag'>
          <Label>
            <img src={`${SVGPath}/job/job-box/dollar-circle.svg`} alt='dollar-circle' className='img-fluid' />
            {data.salary}K USD
          </Label>
          <Label>
            <img src={`${SVGPath}/job/job-box/briefcase.svg`} alt='briefcase' className='img-fluid' />
            {data.jobType?.slice(0, 1).map((job) => job.replace("_", " "))}
          </Label>
          {(segments[1] === "listing" || segments[2] === "job-ad") && (
            <Label>
              <img src={`${SVGPath}/job/job-box/eye-line.svg`} alt='eye-line' className='img-fluid' />
              25 People View
            </Label>
          )}
        </div>
        <ul className='rating'>
          <li>
            <Rating initialValue={data.rating} size={20} />
          </li>
        </ul>
      </div>
      <p>{data.moreDescription}</p>
      <ul className='skill-list'>
        {data.skills?.map((item, i) => (
          <li key={i}>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className='post-time'>
        <div className='post-flex'>
          <div className='post-item'>
            <MapPin className='iconsax' />
            <span>{data.location}</span>
          </div>
          <div className='post-item'>
            <Clock className='iconsax' />
            <span>{data.time}</span>
          </div>
        </div>
        <Link href={RouteList.Pages.Other.ContactUs1} className='btn-solid'>
          {ApplyNow} <i className='ri-arrow-right-up-line' />
        </Link>
      </div>
    </article>
  );
};

export default Job7DetailBox;
