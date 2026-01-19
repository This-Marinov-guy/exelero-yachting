import React from "react";
import { Col } from "reactstrap";
import Link from "next/link";
import { CitySelectMenuProps } from "@/types/HomeDemo";

const CitySelectMenu: React.FC<CitySelectMenuProps> = ({ multiColumn, cityList, selectedCity, onSelectCity, href }) => {
  const cityItems = (
    <ul className='select-menu'>
      {cityList.map((city, key) => (
        <li key={key}>
          <Link scroll={false} className={`select-item ${city === selectedCity ? "active" : ""}`} href={href} onClick={() => onSelectCity(city)}>
            {city}
          </Link>
        </li>
      ))}
    </ul>
  );

  return multiColumn ? (
    <Col xl={4} sm={6}>
      {cityItems}
    </Col>
  ) : (
    cityItems
  );
};

export default CitySelectMenu;
