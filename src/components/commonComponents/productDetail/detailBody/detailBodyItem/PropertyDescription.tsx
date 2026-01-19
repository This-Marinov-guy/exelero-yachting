import { Description, PropertyDescriptionTitle } from "@/constants";
import { DetailDescription, PropertyDetails } from "@/data/property";
import { DetailBodyItemType } from "@/types/Product";
import React, { FC, Fragment } from "react";

const PropertyDescription: FC<DetailBodyItemType> = ({ label, type }) => {
  return (
    <Fragment>
      {type === "car" ? (
        <div className='detail-box' id='description'>
          <h3 className='car-title'>{Description}</h3>
          <p className='mb-md-2'>The streamlined design of a Lamborghini elicits an instinctive reaction, as though speed itself has been condensed into its shape. These doors rise up like the wings of some mythological beast.</p>
          <p>{`Owning a Ferrari is one of the most apparent moves when it comes to marketing your riches. Naturally, some people cannot afford the million-dollar plus offers from Ferrari's Icona series, and even the more affordable variants would cost you half a million dollars. The 2022 Ferrari Portofino M is available for less expensive budgets owning a Ferrari is one of the most apparent moves when it comes to marketing your riches. Naturally, some people cannot afford the million-dollar plus offers from Ferrari's Icona series, and even the more affordable variants would cost you half a million dollars. The Ferrari Portofino M is available for less expensive budgets.`}</p>
        </div>
      ) : (
        <div className='detail-body' id='description'>
          {label && <h4 className='detail-page-title'>{PropertyDescriptionTitle}</h4>}
          <p>{DetailDescription}</p>
          <h4 className='detail-page-title'>{PropertyDescriptionTitle}</h4>
          <ul className='property-detail-page'>
            {PropertyDetails.map((item, index) => (
              <li key={index}>
                <h6>{item.label}</h6>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Fragment>
  );
};

export default PropertyDescription;
