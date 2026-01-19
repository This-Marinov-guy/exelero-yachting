import { BlogSocialData } from "@/data/pages";
import Link from "next/link";
import React from "react";

const FollowUs = () => {
  return (
    <div className='follow-flex'>
      <h4>Follow Us:</h4>
      <ul className='social-list'>
        {BlogSocialData.map((item, i) => {
          return (
            <li key={i}>
              <Link href={item.link} target='_blank'>
                <i className={item.icon} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FollowUs;
