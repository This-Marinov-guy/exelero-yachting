import { BlogDescriptionBoxType } from "@/types/Product";
import React, { FC } from "react";

const BlogDescriptionBox: FC<BlogDescriptionBoxType> = ({ data, title, list }) => {
  return (
    <div className='blog-info'>
      <h4>{title}</h4>
      {list ? (
        <ul className='detail-list'>
          {data.map((item, index) => (
            <li key={index}>
              <p>
                <strong>{item.title} : </strong>
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <ul className='detail-list conclusion-list'>
          {data.map((item, index) => (
            <li key={index}>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogDescriptionBox;
