import { Href } from "@/constants";
import { FilterTabsListData } from "@/data/car";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCardToShow, setOpenFilterSidebar } from "@/redux/reducers/LayoutSlice";
import { setPopular, setSortBy } from "@/redux/reducers/FilterSlice";
import { ProductType, TopPanelType } from "@/types/Product";
import Link from "next/link";
import { FC, Fragment, useMemo, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { usePublicText } from "@/lib/usePublicText";
import { useBoatFilters } from "@/components/pages/boats/BoatFiltersContext";
import { filterBoats } from "../UseFilterBoats";

const FilterTags: FC<TopPanelType & { boatProducts?: ProductType[] }> = ({ topFilter, side, type, mainClass, boatProducts }) => {
  const tr = usePublicText();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const boatQuery = useBoatFilters();
  const { sortBy } = useAppSelector((state) => state.filter);
  const { totalProduct } = useAppSelector((state) => state.layout);
  const boatCount = useMemo(() => type === "boat" && boatQuery && boatProducts ? filterBoats(boatProducts, boatQuery.filters).length : null, [type, boatQuery?.filters, boatProducts]);

  const handleSortBy = (sortOption: string) => {
    if (type === "boat" && boatQuery) {
      boatQuery.setSort(sortOption);
      setDropdownOpen(false);
      return;
    }
    if (sortOption === "Most Popular") {
      dispatch(setPopular(sortOption));
    } else if (sortOption === "24 Product par page") {
      dispatch(setCardToShow(24));
      dispatch(setPopular(null));
    } else {
      dispatch(setPopular(null));
    }
    dispatch(setSortBy(sortOption));
    setDropdownOpen(false);
  };

  const FilterDropdown = (startPoint: number, endPoint: number) => (
    <Dropdown className='select-dropdown' isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
      {type === "boat" && <DropdownToggle className='select-button' color="">{tr(boatQuery?.filters.sortBy || "Sort By")}</DropdownToggle>}
      <DropdownMenu className='select-menu' end>
        {FilterTabsListData.map((item, index) => (
          <DropdownItem onClick={() => handleSortBy(item)} key={index} className="select-item">
            <Link href={Href} scroll={false} onClick={event => event.preventDefault()} className={`select-item ${(type === "boat" ? boatQuery?.filters.sortBy : sortBy) === item ? "active" : ""}`}>
              {tr(item)}
            </Link>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className={`${mainClass ? mainClass : "top-panel"}`}>
      <Fragment>

        <h4>
          {boatCount ?? totalProduct} {tr("results")}
        </h4>

        {topFilter ? <div className='category-filter'>
          <div className='car-sortby-flex'>
            {FilterDropdown(3, 8)}
          </div>
        </div> : <div className='category-filter d-flex justify-content-between align-items-center gap-2'>
          <div className='car-sortby-flex'>
            {FilterDropdown(3, 8)}
          </div>
          <Link href={Href} scroll={false} className={`btn-solid ${side !== "nosidebar" && "filter-btn"}`} onClick={() => dispatch(setOpenFilterSidebar())}>
            {tr("Filter")}
          </Link>
        </div>}
      </Fragment>
    </div>
  );
};

export default FilterTags;
