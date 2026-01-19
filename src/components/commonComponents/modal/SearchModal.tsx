import FilterSidebar from "@/components/commonComponents/gridView/filter";
import { Search } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSearchModal } from "@/redux/reducers/LayoutSlice";
import { setAmenities, setBedsRooms, setPopular, setPriceStatus, setPropertyType, setSortBy, setSquareFeetStatus, setYearBuiltStatus } from "@/redux/reducers/FilterSlice";
import { SearchModalType } from "@/types/CommonComponents";
import { FC, Fragment } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import CloseBtn from "../CloseBtn";

const SearchModal: FC<SearchModalType> = ({ type, carSpaceClass = "" }) => {
  const { searchModal } = useAppSelector((state) => state.layout);
  const { productItem } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const showProduct = productItem.filter((item) => item.type === type);
  const toggle = () => dispatch(setSearchModal());
  const handleReset = () => {
    const resetActions = [setPropertyType([]), setBedsRooms([]), setAmenities([]), setSortBy(null), setPopular(null), setPriceStatus([40000, 500000]), setSquareFeetStatus([400, 4000]), setYearBuiltStatus([2019, 2024])];
    resetActions.forEach(dispatch);
  };

  return (
    <Fragment>
      <div className={`mobile-space ${carSpaceClass}`} />
      <Modal scrollable fade modalClassName='theme-modal search-modal' isOpen={searchModal} toggle={toggle}>
        <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
        <ModalBody>
          <div className='filter-header'>
            <h3>Search</h3>
            <span onClick={handleReset}>Reset</span>
          </div>
          <FilterSidebar type={type} value={showProduct} />
        </ModalBody>
        <ModalFooter>
          <Button className='btn-solid'>{Search}</Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default SearchModal;
