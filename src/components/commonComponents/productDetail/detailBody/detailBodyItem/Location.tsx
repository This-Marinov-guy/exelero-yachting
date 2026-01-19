import { LocationTitle } from "@/constants";
import { DetailBodyItemType } from "@/types/Product";
import { FC } from "react";

const Location: FC<DetailBodyItemType> = ({label}) => {
  return (
    <div className='detail-body' id="location">
      {label && <h4 className='detail-page-title'>{LocationTitle}</h4>}
      <div className='map-section'>
        <iframe src='https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2978629.912434363!2d-80.95037563448182!3d43.192323791353104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1storento!5e0!3m2!1sen!2sin!4v1723783272529!5m2!1sen!2sin' style={{ border: 0 }} allowFullScreen loading='lazy' referrerPolicy='no-referrer-when-downgrade' />
      </div>
    </div>
  );
};

export default Location;
