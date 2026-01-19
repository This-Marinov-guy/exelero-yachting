import { Href } from "@/constants";
import { CarModalBrandsData } from "@/data/car";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCarBrandModel } from "@/redux/reducers/FilterSlice";
import { SearchNormal1 } from "iconsax-react";
import Link from "next/link";
import { FC, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Input, Label } from "reactstrap";

const BrandsFilter: FC<{ id: string }> = ({ id }) => {
  const { carBrandModel } = useAppSelector(state => state.filter);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [openItems, setOpenItems] = useState<string>("");
  const dispatch = useAppDispatch();
  const toggle = (id: string) => setOpenItems(openItems => (openItems === id ? "" : id));

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    let updatedPropertyType = [...carBrandModel];
    const brand = CarModalBrandsData.find(item => item.value === value);

    if (brand) {
      if (checked) updatedPropertyType = [...carBrandModel, brand.value, ...brand.models.map(model => model.id)];
      else updatedPropertyType = updatedPropertyType.filter(selectedValue => selectedValue !== brand.value && !brand.models.some(model => model.id === selectedValue));
    } else {
      if (checked) updatedPropertyType.push(value);
      else updatedPropertyType = updatedPropertyType.filter(selectedValue => selectedValue !== value);
      CarModalBrandsData.forEach(item => {
        const allModelsSelected = item.models.every(model => updatedPropertyType.includes(model.id));
        if (allModelsSelected && !updatedPropertyType.includes(item.value)) updatedPropertyType.push(item.value);
        else if (!allModelsSelected && updatedPropertyType.includes(item.value)) updatedPropertyType = updatedPropertyType.filter(selectedValue => selectedValue !== item.value);
      });
    }
    dispatch(setCarBrandModel(updatedPropertyType));
  };

  const brandList = (BrandData: typeof CarModalBrandsData) =>
    BrandData.map(brand => (
      <div className="main-choose-item" key={brand.id}>
        <div className="choose-item">
          <Input type="checkbox" className="" id={brand.brand} value={brand.value} checked={carBrandModel?.includes(brand.value)} onChange={handleCheckboxChange} />
          <Label className="label-flex" htmlFor={brand.brand}>
            <span>{brand.brand}</span>
            <span>({brand.count})</span>
          </Label>
          <Button className={`accordion-button ${openItems !== brand.id.toString() ? "collapsed" : ""}`} id={`toggler${brand.id}`} onClick={() => toggle(brand.id.toString())} />
        </div>
        <Accordion toggle={toggle} open={openItems}>
          <AccordionItem>
            <AccordionBody accordionId={brand.id.toString()}>
              <ul className="model-list">
                {brand.models.map(model => (
                  <li key={model.id}>
                    <Input type="checkbox" id={model.name} value={model.id} checked={carBrandModel?.includes(model.id)} onChange={handleCheckboxChange} />
                    <Label className="label-flex" htmlFor={model.id}>
                      <span>{model.name}</span>
                      <span>({model.count})</span>
                    </Label>
                  </li>
                ))}
              </ul>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </div>
    ));

  return (
    <AccordionItem>
      <AccordionHeader targetId={id}>Brand + Model</AccordionHeader>
      <AccordionBody accordionId={id}>
        <div className="more-list" style={showMore ? { maxHeight: "none" } : {}}>
          <div className="search-input">
            <SearchNormal1 className="iconsax" size={24} color="rgb(173 173 173)" />
            <Input type="search" placeholder="Search Brand or Model" />
          </div>
          <span className="inner-title">Popular</span>
          <div className="sidebar-choose-list">{brandList(CarModalBrandsData.slice(0, 4))}</div>
          <span className="inner-title">Other</span>
          <div className="sidebar-choose-list">{brandList(CarModalBrandsData.slice(4))}</div>
        </div>
        <Link scroll={false} href={Href} className={`text-btn ${showMore ? "less-btn d-inline-block" : "more-btn"}`} onClick={() => setShowMore(!showMore)}>
          {showMore ? "Show Less" : "Show More"}
        </Link>
      </AccordionBody>
    </AccordionItem>
  );
};

export default BrandsFilter;
