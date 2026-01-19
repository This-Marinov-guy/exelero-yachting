import RangeInputFields from "@/components/commonComponents/gridView/filter/common/RangeInputFields";
import { GifPath, Href, Search, SVGPath } from "@/constants";
import { HomeTabData } from "@/data/demo/common";
import { HomeNavData } from "@/data/demo/demo1";
import { useAppDispatch } from "@/redux/hooks";
import { setSearchModal } from "@/redux/reducers/LayoutSlice";
import { SearchTabListType } from "@/types/HomeDemo";
import { RouteList } from "@/utils/RouteList";
import UseOutsideDropdown from "@/utils/UseOutsideDropdown";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import DatePicker from "react-datepicker";
import { Button, Dropdown, DropdownItem, DropdownMenu, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

const SearchTabList: FC<SearchTabListType> = ({ showTab, datePicker, scrollDown, form, pills, endPoint, tabs, showNav, button, icon, car2 }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selected, setSelected] = useState(HomeTabData.filter(({ id }) => showTab?.includes(id)));
  const [basicTab, setBasicTab] = useState(1);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [path] = pathname.split("/").slice(1);

  const dropdownRefs = selected.map(() => UseOutsideDropdown(false));

  const handleSelect = (id: number, value: string) => {
    setSelected((prev) => prev.map((item) => (item.id === id ? { ...item, inputLabel: value } : item)));
  };

  const handleChange = (date: Date, id: number) => {
    setStartDate(date);
    handleSelect(id, format(date, "MM/dd/yyyy"));
  };

  const NavigateLink = path.includes("job") ? RouteList.Job.Grid.JobGridType2 : path.includes("property") ? RouteList.Property.Grid.Property2Grid : RouteList.Car.Grid.Car3Grid;

  return (
    <>
      {!showNav && (
        <Nav pills={pills} tabs={tabs}>
          {HomeNavData.slice(0, endPoint || 3).map((item, index) =>
            datePicker ? (
              <NavItem key={item.id}>
                <NavLink href={Href} className={basicTab === item.id ? "active" : ""} color='transparent' onClick={() => setBasicTab(item.id)} key={index}>
                  {item.title}
                  {!icon && <i className='ri-arrow-right-line' />}
                </NavLink>
              </NavItem>
            ) : button ? (
              <NavItem key={item.id}>
                <Button className={`nav-link ${basicTab === item.id ? "active" : ""}`} color='transparent' onClick={() => setBasicTab(item.id)} key={index}>
                  {item.title}
                  {!icon && <i className='ri-arrow-right-line' />}
                </Button>
              </NavItem>
            ) : (
              <NavLink href={Href} className={basicTab === item.id ? "active" : ""} color='transparent' onClick={() => setBasicTab(item.id)} key={index}>
                {item.title}
                {!icon && <i className='ri-arrow-right-line' />}
              </NavLink>
            )
          )}
        </Nav>
      )}
      <TabContent activeTab={basicTab}>
        <TabPane className="fade show" tabId={basicTab}>
          <ul className={form ? "home-form" : "tab-list"}>
            {selected.map((item, index) => (
              <li className={form ? "input-box" : "tab-item"} key={item.id}>
                {!form && (
                  <div className='label-flex'>
                    {item.icon}
                    <Label>{item.label}</Label>
                  </div>
                )}
                <div ref={dropdownRefs[index].ref} className='select-dropdown'>
                  <Dropdown isOpen={dropdownRefs[index].isComponentVisible} toggle={() => dropdownRefs[index].setIsComponentVisible(!dropdownRefs[index].isComponentVisible)}>
                    <div className='select-button' onClick={() => dropdownRefs[index].setIsComponentVisible(true)}>
                      <Input type='text' value={item.inputLabel} placeholder={item.inputLabel || "Select an option"} readOnly />
                      {car2 && <img src={`${SVGPath}/car2/arrow.svg`} alt='arrow-svg' className='img-fluid' />}
                    </div>
                    <DropdownMenu className='select-menu'>
                      {item.dropdownMenu ? (
                        item.dropdownMenu?.map((list, idx) => (
                          <DropdownItem
                            key={idx}
                            onClick={() => {
                              handleSelect(item.id, list.title);
                              dropdownRefs[index].setIsComponentVisible(false);
                            }}
                            className={`${item.inputLabel === list.title ? "active" : ""}`}
                          >
                            {list.icon && list.icon}
                            <h6>{list.title}</h6>
                          </DropdownItem>
                        ))
                      ) : datePicker ? (
                        <DatePicker selected={startDate} onChange={(date: Date | null) => date && handleChange(date, item.id)} inline />
                      ) : (
                        <div className='range-slider'>
                          <RangeInputFields />
                        </div>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </li>
            ))}
            {form && (
              <li className='input-box select-button' onClick={() => dispatch(setSearchModal())}>
                <Input type='text' placeholder='Advanced' readOnly />
              </li>
            )}
            <li className='tab-item'>
              <Link href={NavigateLink} className={`btn-solid  ${form ? "property2-change" : car2 ? "btn-pills" : ""}`}>
                {Search}
              </Link>
            </li>
            {scrollDown && (
              <li className='scroll-down tab-item'>
                <a href="#header">
                  <Image width={83} height={99} src={`${GifPath}/mouse-animation.gif`} unoptimized alt='mouse-animation' className='img-fluid' />
                </a>
              </li>
            )}
          </ul>
        </TabPane>
      </TabContent>
    </>
  );
};

export default SearchTabList;
