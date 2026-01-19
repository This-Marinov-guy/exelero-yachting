import { ApplyNow, JoinNetwork, KeyJobDetailTitle, SVGPath } from "@/constants";
import { ContactForm } from "@/data/job";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";

const KeyJobDetail = () => {
  return (
    <div className='detail-right-sidebar'>
      <h6>{KeyJobDetailTitle}</h6>
      <ul className='key-info'>
        {ContactForm.map((item, i) => {
          return (
            <li key={i}>
              <div className="key-icon">
                <Image height={30} width={30} src={`${SVGPath}${item.url}`} alt={`jd-${i + 1}`} />
              </div>
              <span>{item.title}:</span>
              {item.detail}
            </li>
          );
        })}
      </ul>
      <div className='apply-btn'>
        <Link href={RouteList.Pages.Other.AboutUs1} className='btn-solid'>
          {ApplyNow}
        </Link>
      </div>
      <h6 className='mb-2'>Don’t see a fit at this time?</h6>
      <p>Be at ease. Become a member of our Talent Network to receive updates on the newest positions.</p>
      <Link href={RouteList.Pages.Other.AboutUs1} className='arrow-btn'>
        {JoinNetwork} <i className='ri-arrow-right-up-line' />
      </Link>
    </div>
  );
};

export default KeyJobDetail;
