import { BlogDetailLabel, ImagePath, RoseRoberts } from "@/constants";
import React from "react";

const BlogContentTitle = () => {
  return (
    <div className='blog-detail-title'>
      <h3>{BlogDetailLabel}</h3>
      <ul className='blog-view-list'>
        <li className='author-name-box'>
          <img src={`${ImagePath}/car/testimonial/4.jpg`} alt='p-1' className='img-fluid' />
          <span className='author-name'>{RoseRoberts}</span>
        </li>
        <li>
          <i className='ri-calendar-line' />
          <span>03/12/2025</span>
        </li>
        <li>
          <i className='ri-eye-line' />
          <span>20K Viewed</span>
        </li>
      </ul>
    </div>
  );
};

export default BlogContentTitle;
