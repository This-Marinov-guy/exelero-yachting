import React, { useState } from "react";
import Link from "next/link";
import { Href } from "@/constants";
import { Cities } from "@/data/layout/Header";
import { PropertyDropDownProps } from "@/types/Layout";
import CitySelectMenu from "@/components/themes/common/CitySelectMenu";

const PropertyDropdown: React.FC<PropertyDropDownProps> = ({ isJobOrProperty }) => {
  const [selectedCity, setSelectedCity] = useState("Amsterdam");
  return (
    <div>
      {!isJobOrProperty && (
        <div className='select-dropdown'>
          <Link scroll={false} href={Href} className='select-button'>
            {selectedCity}
          </Link>
          <div className='mega-menu-1'>
            <CitySelectMenu multiColumn={false} cityList={Cities} selectedCity={selectedCity} onSelectCity={(city) => setSelectedCity(city)} href={Href} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDropdown;
