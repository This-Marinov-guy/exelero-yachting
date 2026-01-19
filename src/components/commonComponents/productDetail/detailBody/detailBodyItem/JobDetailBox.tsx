import { JobDetail } from "@/types/Product";
import React, { FC } from "react";

const JobDetailBox: FC<JobDetail> = ({ content, title, list }) => {
  return (
    <div className='description-box'>
      <h5 className='description-title'>{title}</h5>
      {list ? (
        <ul>
          {content.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
};

export default JobDetailBox;
