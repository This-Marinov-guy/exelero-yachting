import { FurnishingDetail } from "@/constants";
import { FurnishingDetailListData } from "@/data/pages/Others";
import React from "react";
import { Input } from "reactstrap";

const PropertyCheckbox = () => {
  return (
    <div className='user-form-box'>
      <h4 className='dashboard-title'>{FurnishingDetail}</h4>
      <ul className='user-choose-list'>
        {FurnishingDetailListData.map((item, i) => {
          return (
            <li key={i} className='main-choose-item'>
              <div className='choose-item'>
                <Input type='checkbox' id={`Furnishing-${i + 1}`} />
                <label className='label-flex' htmlFor={`Furnishing-${i + 1}`}>
                  <span>{item}</span>
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PropertyCheckbox;
