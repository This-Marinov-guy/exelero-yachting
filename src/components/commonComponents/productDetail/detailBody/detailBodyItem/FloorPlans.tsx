import { FloorPlansTitle, ImagePath } from "@/constants";
import { FloorItems, FloorPlansDescription } from "@/data/property";
import { DetailBodyItemType } from "@/types/Product";
import SvgIcon from "@/utils/SvgIcon";
import React, { FC } from "react";

const FloorPlans: FC<DetailBodyItemType> = ({ label }) => {
  return (
    <div className='detail-body' id="floor">
      {label && <h4 className='detail-page-title'>{FloorPlansTitle}</h4>}
      <p className='p-0'>{FloorPlansDescription}</p>
      <div className='floor-img'>
        <ul className='floor-list'>
          {FloorItems.map((item, index) => (
            <li className='floor-item' key={index}>
              <div className='floor-icon'>
                <SvgIcon iconId={`/property/sprite/overview.svg#${item.icon}`} />
                <span>{item.count}</span>
              </div>
              <h5>{item.label}</h5>
            </li>
          ))}
        </ul>
        <img src={`${ImagePath}/property/detail/floor.png`} alt='f-2' className='img-fluid' />
      </div>
    </div>
  );
};

export default FloorPlans;
