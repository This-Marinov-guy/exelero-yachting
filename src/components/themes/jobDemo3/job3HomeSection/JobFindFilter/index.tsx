import CitySelectMenu from "@/components/themes/common/CitySelectMenu";
import { Href, ImagePath, Search, SVGPath } from "@/constants";
import { Cities } from "@/data/demo/jobDemo2";
import { JobHomeSvg, SelectExperience } from "@/data/demo/jobDemo3";
import { dynamicNumber } from "@/utils";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import { SearchNormal1 } from "iconsax-react";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { Col, Container, Dropdown, DropdownMenu, DropdownToggle, Input, Row } from "reactstrap";

const JobFindFilter = () => {
  const [selectedCity, setSelectedCity] = useState<string[]>(["Select Experience", "Select Location"]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean[]>([false, false]);

  const toggleDropdown = (index: number) => {
    setDropdownOpen((prev) => prev.map((isOpen, i) => (i === index ? !isOpen : isOpen)));
  };

  const handleCitySelection = (index: number, city: string) => {
    const updatedSelectedCity = [...selectedCity];
    updatedSelectedCity[index] = city;
    setSelectedCity(updatedSelectedCity);
  };
  return (
    <Fragment>
        <ul className='home-icons'>
        {JobHomeSvg.map((item, i) => (
          <li key={i}>
            <div className='job-bg-icon'>
              <RatioImage src={`${SVGPath}/job/job-box/${item}.svg`} alt={`ji-${item}`} className='img-fluid' />
            </div>
          </li>
        ))}
      </ul>
      <RatioImage src={`${ImagePath}/job-3/bg-effect/home-bg-effect.png`} alt='' className='bg-img' />
      {/* Main Content */}
      <Container>
        <Row className='justify-content-center'>
          <Col xxl={8} xl={9} lg={10}>
            <div className='home-content'>
              <h1 className='text-white'>Find your Next Job and Make your Own Goal</h1>
              <p>Discover trusted job opportunities tailored to your skills and aspirations. Join our community and let us guide you towards success.</p>
              <div className='search-input-home'>
                {/* Input for skills/companies */}
                <div className='icon-search'>
                  <SearchNormal1 className="iconsax"/>
                  <Input type='text' className='form-control' placeholder='Enter skills / Companies' />
                </div>

                {/* Dropdowns for Experience and Location */}
                {dynamicNumber(2).map((item, index) => (
                  <Dropdown isOpen={dropdownOpen[index]} toggle={() => toggleDropdown(index)} className={`select-dropdown ${item === 2 ? "full-dropdown" : ""} d-md-inline-block d-none`} key={index}>
                    <DropdownToggle className='select-button' caret color="transparent">
                      {selectedCity[index]}
                    </DropdownToggle>
                    <DropdownMenu>
                      {item === 1 ? (
                        <ul className='select-menu'>
                          {SelectExperience.map((experience, i) => (
                            <li key={i}>
                              <Link className='select-item' href={Href} onClick={() => handleCitySelection(index, experience)}>
                                {experience}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Row className="gy-xl-0 gy-3">
                          {Cities.map((cityList, i) => (
                            <CitySelectMenu key={i} multiColumn cityList={cityList} selectedCity={selectedCity[index]} onSelectCity={(city) => handleCitySelection(index, city)} href={Href} />
                          ))}
                        </Row>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                ))}
                <Link href={RouteList.Job.Grid.JobGrid2} className='btn-solid'>
                  {Search}
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default JobFindFilter