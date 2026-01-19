import { GifPath, ImagePath } from "@/constants";
import { BlogGridBoxType } from "@/types/CommonComponents";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

const BlogTitleBox: FC<BlogGridBoxType> = ({ data }) => {
  return (
    <article className='blog-grid-box'>
      <div className='blog-img'>
        <Link href={RouteList.Pages.Blog.Detail.BlogLeftClassic}>
          <RatioImage src={`${ImagePath}/${data.image}`} alt='bi-1' className='img-fluid bg-img' />
        </Link>
        {data.fireBox && (
          <div className='fire-box'>
            <Image width={16} height={17} src={`${GifPath}/fire.gif`} alt='fire' className='img-fluid' />
          </div>
        )}
      </div>
      <div className='blog-content'>
        <Link href={RouteList.Pages.Blog.Detail.BlogLeftClassic} className='blog-title'>
          {data.title}
        </Link>
        <ul className='blog-view-list'>
          <li>
            <i className='ri-calendar-line' />
            <span>{data.date}</span>
          </li>
          <li>
            <i className='ri-eye-line' />
            <span>{data.views} Viewed</span>
          </li>
        </ul>
        <div className='author-flex'>
          <div className='author-name-box'>
            <Image width={25} height={25} src={`${ImagePath}/${data.authorImage}`} alt='p-1' className='img-fluid' unoptimized/>
            <div className='author-name'>
              <span>{data.author}</span>
            </div>
          </div>
          <Link href={RouteList.Pages.Blog.Detail.BlogLeftClassic} className='read-arrow'>
            <i className='ri-arrow-right-down-line' />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogTitleBox;
