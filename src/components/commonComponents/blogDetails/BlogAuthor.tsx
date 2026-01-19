import { AboutAuthorTitle, FounderTitle, ImagePath, RoseRoberts, WriterTitle } from "@/constants";
import { BlogSocialData } from "@/data/pages";
import { AuthorDescription } from "@/data/pages/Blog";
import Image from "next/image";
import Link from "next/link";

const BlogAuthor = () => {
  return (
    <article className='about-author-main'>
      <h3>{AboutAuthorTitle}</h3>
      <div className='author-box'>
        <div className='author-img'>
          <Image height={130} width={130} src={`${ImagePath}/car/testimonial/4.jpg`} alt='a-1' className='img-fluid' unoptimized/>
        </div>
        <div className='author-info'>
          <div className='author-flex'>
            <div className='tag-flex'>
              <h4>{RoseRoberts}</h4>
              <label>
                {FounderTitle} &amp; {WriterTitle}
              </label>
            </div>
            <ul className='social-list'>
              {BlogSocialData.slice(0, 3).map((item, i) => {
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
          <p>{AuthorDescription}</p>
        </div>
      </div>
    </article>
  );
};

export default BlogAuthor;
