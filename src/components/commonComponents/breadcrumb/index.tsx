import { ImagePath } from "@/constants";
import { BreadcrumbsType } from "@/types/CommonComponents";
import RatioImage from "@/utils/RatioImage";
import Link from "next/link";
import { FC } from "react";
import { Container } from "reactstrap";

const Breadcrumbs: FC<BreadcrumbsType> = ({ title, image, subTitle, url, mainClass }) => {
  return (
    <div className={`${mainClass ? mainClass : "breadcrumbs-section without-search-breadcrumbs"} `}>
      <Container>
        <div className='breadcrumbs-main'>
          <h2>{title}</h2>
          <ul className='breadcrumbs-list'>
            <li>
              <Link href={url}>Home</Link>
            </li>
            <li>{subTitle || title}</li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default Breadcrumbs;
