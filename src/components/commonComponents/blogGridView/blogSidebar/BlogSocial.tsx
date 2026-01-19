import { SocialContact } from "@/constants";
import { BlogSocialData } from "@/data/pages";
import Link from "next/link";
import React from "react";

const BlogSocial = () => {
  return (
    <div className='blog-sidebar-box'>
      <div className='sidebar-title'>
        <h4>{SocialContact}</h4>
      </div>
      <ul className='social-list'>
        {BlogSocialData.map((item, i) => {
          return (
            <li key={i}>
              <Link href={item.link} target='_blank'>
                <i className={item.icon} />
                <div className='social-name'>
                  <h6>{item.platform}</h6>
                  <span>{item.followers}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BlogSocial;
